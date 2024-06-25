import { Router } from "express";
import { LineaService } from "../../services/linea.service";
import { WinstonAdapter } from "../../config";
import { LineaController } from "./linea.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class LineaRoutes{

    static get routes(): Router{
    const router = Router();

    const logger = new WinstonAdapter();
    const lineaService = new LineaService(logger);
    const controller = new LineaController(lineaService);


    router.post("/", AuthMiddleware.validateJWT, controller.createLinea);
    router.get("/", AuthMiddleware.validateJWT, controller.getLineas);
    router.get("/:id", AuthMiddleware.validateJWT, controller.getLineaById);
    router.put("/:id", AuthMiddleware.validateJWT, controller.updateLinea);
    router.delete("/:id", AuthMiddleware.validateJWT, controller.deleteLinea);

        return router
    }
}