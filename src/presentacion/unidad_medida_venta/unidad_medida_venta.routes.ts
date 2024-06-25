import { Router } from "express";
import { UnidadMedidaVentaService } from "../../services/unidad_medida_venta.service";
import { WinstonAdapter } from "../../config";
import { UnidadMedidaVentaController } from "./unidad_medida_venta.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class UnidadMedidaVentaRoutes {

    static get routes(): Router {
        const router = Router();

        const logger = new WinstonAdapter();
        const unidadMedidaVentaService = new UnidadMedidaVentaService(logger);
        const controller = new UnidadMedidaVentaController(unidadMedidaVentaService);


        router.post("/", AuthMiddleware.validateJWT, controller.createUnidadMedidaVenta);
        router.get("/", AuthMiddleware.validateJWT, controller.getUnidadesMedidaVenta);
        router.get("/:id", AuthMiddleware.validateJWT, controller.getUnidadMedidaVentaById);
        router.put("/:id", AuthMiddleware.validateJWT, controller.updateUnidadMedidaVenta);
        router.delete("/:id", AuthMiddleware.validateJWT, controller.deleteUnidadMedidaVenta);

        return router
    }
}