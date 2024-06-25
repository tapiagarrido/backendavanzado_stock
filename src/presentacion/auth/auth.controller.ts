import { Request, Response } from "express";
import { CustomError, LoginDto, RegistrarUsuarioDto } from "../../dominio";
import { AuthService } from "../../services/auth.service";



export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: 'Internal server Error' });
    }

    registrarUsuario = async (req: Request, res: Response) => {
        const [error, registrarUsuarioDto] = RegistrarUsuarioDto.create(req.body);
        if (error) return res.status(400).json(error);

        this.authService.registrarUsuario(registrarUsuarioDto!)
            .then(usuario => res.status(201).json(usuario))
            .catch(error => this.handleError(error, res));
    }

    validarCorreo = (req: Request, res: Response) => {
        const { token } = req.params;
        this.authService.activarCuentaUsuario(token)
            .then(() => res.json("Email ha sido validado"))
            .catch(error => this.handleError(error, res));
    }

    iniciarSesion = async (req: Request, res: Response) => {
        const [error, loginDto] = LoginDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.authService.inicioSesion(loginDto!)
            .then(usuario => res.json(usuario))
            .catch(error => {
                console.log(error);
                if (error.statusCode !== 401) {
                    this.handleError(error, res)
                } else {
                    res.status(401).json({
                        error: error.message,
                        inactivo: true
                    })
                }
            }
            );
    }

    sesionActiva = async (req:Request, res: Response) => {
        return res.json(req.body.usuario);
    }

    reenviarTokenActivacion = async (req: Request, res: Response) => {
        const { email } = req.body;
        console.log(req.body)
        if (!email) return res.status(400).json({ msg: "No se ha encontrado un correo valido" });

        this.authService.solicitarTokenActivacion(email)
            .then(respuesta => res.status(200).json(respuesta))
            .catch(error => this.handleError(error, res));

    }
}