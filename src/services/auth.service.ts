import { JwtAdapter, Roles, Uuid, WinstonAdapter, bcryptAdapter, envs } from "../config";
import { prisma } from "../data/postgres";
import { CustomError, LoginDto, RegistrarUsuarioDto } from "../dominio";
import { EmailService } from "./email.service";

//Todo: crear funcion que implemente que el primer usuario registrado en el sistema tenga un rol administrador

export class AuthService {

    constructor(
        private readonly emailService: EmailService,
        private readonly logger: WinstonAdapter
    ) { }

    public async registrarUsuario(registrarUsuarioDto: RegistrarUsuarioDto) {

        this.logger.mostrarInfo("Se ha iniciado el registro de un usuario")

        // Creamos la variable usuario para su posterior uso en el envio de correo y activacion
        let usuario = null;

        // Comprobamos que el email no este ocupado
        const existeUsuario = await prisma.usuarios.findUnique({ where: { email: registrarUsuarioDto.email } });
        if (existeUsuario) throw CustomError.badRequestError("El email ingresado ya esta registrado");

        // Buscamos en las configuraciones del sistema el parametro de administrador
        const existeAdministrador = await prisma.configuracion.findUnique({ where: { parametro: "administrador_registrado" } });
        if (!existeAdministrador) throw CustomError.badRequestError("No existe informacion sobre los administradores");

        // Agregamos al objeto del usuario un id unico y hash de las password
        const dataActualizada = {
            ...registrarUsuarioDto,
            id: Uuid.v4(),
            contrasena: bcryptAdapter.hash(registrarUsuarioDto.contrasena)
        };


        try {
            // Si el administrador del sistema no existe se registra el primer usuario y se actualiza la configuracion agregando el id del usuario creado
            if (!existeAdministrador.valor) {

                this.logger.mostrarInfo("El usuario será un administrador")

                usuario = await prisma.usuarios.create({
                    data: {
                        ...dataActualizada, rol_id: Roles.ADMINISTRADOR,
                    }
                });

                await prisma.configuracion.update({
                    where: {
                        id: existeAdministrador.id,
                    },
                    data: { ...existeAdministrador, valor: usuario.id, updated_at: new Date() }

                });

                const { contrasena, created_at, updated_at, deleted_at, id, rol_id, ...nuevoUsuario } = usuario;

                this.logger.mostrarInfo("Iniciando envio de correo de confirmacion");

                await this.enviarEmailActivacion(nuevoUsuario.email);

                const token = await JwtAdapter.generarToken({ id, rol_id });
                if (!token) throw CustomError.internalServerError("Se ha generado un error durante la generación del Token");

                return {
                    usuario: nuevoUsuario,
                    token: token,
                    msg: "Usuario administrador registrado exitosamente"
                };
            }

            // En caso contrario los usuarios registrados se crearan pero no tendran un rol definido hasta que el administrador se los otorgue

            this.logger.mostrarInfo("El usuario sera basico")

            usuario = await prisma.usuarios.create({
                data: dataActualizada
            });

            // Desestructuramos para quitar de la respuesta datos sensibles
            const { contrasena, created_at, updated_at, deleted_at, id, rol_id, ...nuevoUsuario } = usuario;

            this.logger.mostrarInfo("Iniciando envio de correo de confirmacion");

            await this.enviarEmailActivacion(nuevoUsuario.email);

            // Se genera el token para la respuesta
            const token = await JwtAdapter.generarToken({ id, rol_id });
            if (!token) throw CustomError.internalServerError("Se ha generado un error durante la generación del Token");

            return {
                usuario: nuevoUsuario,
                token: token,
                msg: "Usuario registrado exitosamente"
            };

        } catch (error) {
            this.logger.mostrarError("Se ha generado un error")
            throw CustomError.internalServerError(`Error de servidor: ${error}`);

        }
    }

    public async inicioSesion(loginDto: LoginDto) {

        this.logger.mostrarInfo(`Usuario con correro ${loginDto.email} iniciando sesion`);

        // Comprobamos que el email este registrado
        const existeUsuario = await prisma.usuarios.findFirst({ where: { email: loginDto.email } });
        if (!existeUsuario) throw CustomError.badRequestError("No existe una cuenta registrada con este correo");

        // Comprobar si la contraseña 
        if (!bcryptAdapter.compare(loginDto.contrasena, existeUsuario.contrasena)) throw CustomError.badRequestError("La contraseña ingresada es incorrecta");

        // Comprobar si la cuenta esta activa
        if (!existeUsuario.activo) throw CustomError.unauthorizedError("La cuenta no esta activa, revisar correo");

        const { contrasena, created_at, updated_at, deleted_at, id, ...usuarioLogueado } = existeUsuario;

        const token = await JwtAdapter.generarToken({ id: existeUsuario.id, email: usuarioLogueado.email, telefono: usuarioLogueado.telefono, nombre_completo: usuarioLogueado.nombre_completo, alias: usuarioLogueado.alias });
        if (!token) throw CustomError.internalServerError("No se ha podido generar el token");

        return {
            usuario: usuarioLogueado,
            token,
            msg: `Bienvenido ${usuarioLogueado.alias} que bueno que estes aqui`
        }

    }

    public activarCuentaUsuario = async (token: string) => {

        this.logger.mostrarInfo("Se ha iniciado la activacion de la cuenta");

        const payload = await JwtAdapter.validacionToken(token);
        if (!payload) throw CustomError.internalServerError("El token no es valido");

        const { email } = payload as { email: string };

        if (!email) throw CustomError.internalServerError("El correo no se encuentra en el token");

        const usuario = await prisma.usuarios.findUnique({ where: { email } });
        if (!usuario) throw CustomError.internalServerError("El correo no exta registrado");
        if (usuario.activo === true) return true;

        usuario.activo = true;
        await prisma.usuarios.update({
            where: {
                id: usuario.id
            },
            data: usuario
        })

        return true
    }

    public solicitarTokenActivacion = async (email: string) => {

        this.logger.mostrarInfo("Se ha iniciado la solicitud nuevamente del token a correo");

        const correoValido = await prisma.usuarios.findFirst({ where: { email: email } });
        if (!correoValido) throw CustomError.badRequestError("El correo ingresado no esta registrado");

        try {
            const correoEnviado = await this.enviarEmailActivacion(email);
            return {
                msg: `Señor ${correoValido.nombre_completo} su enlace de activación fue enviado al correo ${email}`
            }
        } catch (error) {
            this.logger.mostrarError("Algo ha salido mal");
            throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    // Metodo utilizado solo dentro del servicio para enviar el correo electronico de activacion.

    private enviarEmailActivacion = async (email: string) => {

        const token = await JwtAdapter.generarToken({ email });
        if (!token) throw CustomError.internalServerError("Error al generar token");

        const link = `${envs.WEBSERVICE_URL}/${token}`;
        const html = `
        <h1>Validación de la cuenta</h1>
        <p>Haz click para validar tu correo electronico</p>
        <a href="${link}">Validar: ${email}</a>`;

        const opciones = {
            to: email,
            subject: "Validar Correo",
            htmlBody: html
        };

        const correoEnviado = await this.emailService.sendEmail(opciones);
        if (!correoEnviado) throw CustomError.internalServerError("No se ha podido enviar el correo");

        return true;
    }

}