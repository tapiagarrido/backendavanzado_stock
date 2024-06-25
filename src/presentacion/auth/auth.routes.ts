import { Router } from "express";
import { AuthService } from "../../services/auth.service";
import { AuthController } from "./auth.controller";
import { EmailService } from "../../services/email.service";
import { WinstonAdapter, envs } from "../../config";
import { AuthMiddleware } from "../middlewares/auth.middleware";



export class AuthRoutes {

    static get routes(): Router {

        const router = Router();

        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
            envs.SEND_EMAIL
        );
        const logger = new WinstonAdapter();
        const authService = new AuthService(emailService, logger);
        const controller = new AuthController(authService);

        router.post("/registrar", controller.registrarUsuario);
        router.post("/iniciar-sesion", controller.iniciarSesion);
        router.get("/activar-cuenta/:token", controller.validarCorreo);
        router.post("/reenviar-token", controller.reenviarTokenActivacion);
        router.get("/sesion",AuthMiddleware.validateJWT,controller.sesionActiva);

        return router;
    }
}