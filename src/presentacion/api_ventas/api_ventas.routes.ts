import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { ApiVentasService } from "../../services/api_ventas.service";
import { ApiVentasController } from "./api_ventas.controller";
import { WinstonAdapter } from "../../config";


export class ApiVentaRoutes {

    static get routes(): Router {

        const router = Router();

        const logger = new WinstonAdapter();
        const apiVentaService = new ApiVentasService(logger);
        const controller = new ApiVentasController(apiVentaService);

        router.post("/", AuthMiddleware.validateJWT, controller.createVenta);
        router.get("/", AuthMiddleware.validateJWT, controller.getVentas);
        router.get("/:id", AuthMiddleware.validateJWT, controller.getVenta);

        return router;
    }
}