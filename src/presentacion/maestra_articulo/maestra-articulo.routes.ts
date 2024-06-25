import { Router } from "express";
import { MaestraArticuloService } from "../../services/maestra_articulo.service";
import { WinstonAdapter } from "../../config";
import { MaestraArticuloController } from "./maestra-articulo.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class MaestraArticuloRoutes {

    static get routes(): Router {

        const router = Router();

        const logger = new WinstonAdapter();
        const maestraArticuloService = new MaestraArticuloService(logger);
        const controller = new MaestraArticuloController(maestraArticuloService);

        router.post("/", AuthMiddleware.validateJWT, controller.createArticulo);
        router.get("/", AuthMiddleware.validateJWT, controller.getArticulos);
        router.get("/buscar", AuthMiddleware.validateJWT, controller.searchArticulos);
        router.get("/:id", AuthMiddleware.validateJWT, controller.getArticuloById);
        router.put("/:id", AuthMiddleware.validateJWT, controller.updateArticulo);
        router.delete("/:id", AuthMiddleware.validateJWT, controller.deleteArticulo);

        return router;
    }
}