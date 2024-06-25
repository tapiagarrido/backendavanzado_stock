import { AuthMiddleware } from "../middlewares/auth.middleware";
import { Router } from "express";
import { StockService } from "../../services/stock.service";
import { StockDetalleService } from "../../services/stock_detalle.service";
import { StockController } from "./stock.controller";
import { WinstonAdapter } from "../../config";

export class StockRoutes {

    static get routes(): Router {

        const router = Router();

        const logger = new WinstonAdapter();
        const detalleStockService = new StockDetalleService(logger);
        const stockService = new StockService(detalleStockService, logger);
        const controller = new StockController(stockService);

        router.post("/", AuthMiddleware.validateJWT, controller.createStock);
        router.get("/", AuthMiddleware.validateJWT, controller.getStocks);
        router.get("/:id", AuthMiddleware.validateJWT, controller.getStockById);
        router.put("/:id", AuthMiddleware.validateJWT, controller.updateStock);
        router.delete("/:id/:id_detalle",AuthMiddleware.validateJWT, controller.deleteStock);

        return router;
    }
}