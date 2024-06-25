import { Router } from "express";
import { CategoriaService } from "../../services/categoria.service";
import { CategoriaController } from "./categoria.controller";

export class CategoriaRoutes{

    static get routes(): Router{

        const router = Router();

        const categoriaService = new CategoriaService();
        const controller = new CategoriaController(categoriaService);

        router.post("/", controller.createCategoria);
        router.get("/", controller.getCategorias);
        router.get("/:id", controller.getCategoriaById);
        router.put("/:id", controller.updateCategoria);
        router.delete("/:id", controller.deleteCategoria);

        return router;
    }
}