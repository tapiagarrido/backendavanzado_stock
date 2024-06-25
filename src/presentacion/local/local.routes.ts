import { Router } from "express";
import { LocalService } from "../../services/local.service";
import { WinstonAdapter } from "../../config";
import { LocalController } from "./local.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class LocalRoutes {

    static get routes(): Router {
        const router = Router();

        const logger = new WinstonAdapter();
        const localService = new LocalService(logger);
        const controller = new LocalController(localService);


        router.post("/", AuthMiddleware.validateJWT, controller.createLocal);
        router.get("/", AuthMiddleware.validateJWT, controller.getLocales);
        router.get("/:id", AuthMiddleware.validateJWT, controller.getLocalById);
        router.put("/:id", AuthMiddleware.validateJWT, controller.updateLocal);
        router.delete("/:id", AuthMiddleware.validateJWT, controller.deleteLocal);

        return router
    }
}