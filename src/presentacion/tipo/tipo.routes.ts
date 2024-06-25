import { AuthMiddleware } from "../middlewares/auth.middleware";
import { Router } from "express";
import { TipoService } from "../../services/tipo.service";
import { TipoController } from "./tipo.controller";
import { WinstonAdapter } from "../../config";

export class TipoRoutes {

    static get routes(): Router {

        const router = Router();

        const logger = new WinstonAdapter();
        const tipoService = new TipoService(logger);
        const controller = new TipoController(tipoService);

        router.post("/", AuthMiddleware.validateJWT, controller.createTipo);
        router.get("/", AuthMiddleware.validateJWT, controller.getTipos);
        router.get("/:id", AuthMiddleware.validateJWT, controller.getTipoById);
        router.put("/:id", AuthMiddleware.validateJWT, controller.updateTipo);
        router.delete("/:id", AuthMiddleware.validateJWT, controller.deleteTipo);

        return router;
    }
}