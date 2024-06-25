import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../../config";
import { prisma } from "../../data/postgres";


export class AuthMiddleware {

    static async validateJWT(req: Request, res: Response, next: NextFunction) {

        const authorization = req.header('Authorization');
        if (!authorization) {
            const error = new Error("El token no se encuentra")
            return res.status(401).json({ error: error.message });
        }
        
        if (!authorization?.startsWith('Bearer')) {
            const error = new Error("El token no contiene el formato Bearer")
            return res.status(401).json({ error: error.message });
        }

        const token = authorization.split(' ').at(1) || '';

        try {

            const payload = await JwtAdapter.validacionToken<{ id: string }>(token);
            if (!payload) {
                const error = new Error("Token no valido")
                return res.status(401).json({ error: error.message });
            }

            const usuario = await prisma.usuarios.findUnique({ where: { id: payload.id } });
            if (!usuario) {
                const error = new Error("Token invalido - no se encuentra un usuario")
                return res.status(401).json({ error: error.message });
            }
            const { created_at, updated_at, deleted_at, contrasena, activo, ...datosUsuario } = usuario;
            req.body.usuario = datosUsuario;
            next();
        } catch (error) {
            console.log(`Ha ocurrido un error: ${error}`)
        }

    }
}