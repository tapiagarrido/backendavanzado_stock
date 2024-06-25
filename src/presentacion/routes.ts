import { Router } from 'express';
import { CategoriaRoutes } from './categoria/categoria.routes';
import { TipoRoutes } from './tipo/tipo.routes';
import { AuthRoutes } from './auth/auth.routes';
import { LineaRoutes } from './linea/linea.routes';
import { LocalRoutes } from './local/local.routes';
import { UnidadMedidaVentaRoutes } from './unidad_medida_venta/unidad_medida_venta.routes';
import { MaestraArticuloRoutes } from './maestra_articulo/maestra-articulo.routes';
import { StockRoutes } from './stock/stock.routes';
import { ApiVentaRoutes } from './api_ventas/api_ventas.routes';

export class AppRoutes {


    static get routes(): Router {

        const router = Router();

        router.use("/api/auth", AuthRoutes.routes);
        router.use("/api/categorias", CategoriaRoutes.routes);
        router.use("/api/tipos", TipoRoutes.routes);
        router.use("/api/lineas", LineaRoutes.routes);
        router.use("/api/locales", LocalRoutes.routes);
        router.use("/api/unidades-medida-venta", UnidadMedidaVentaRoutes.routes);
        router.use("/api/maestra-articulo", MaestraArticuloRoutes.routes);
        router.use("/api/stocks", StockRoutes.routes);
        router.use("/api/ventas", ApiVentaRoutes.routes);

        return router;
    }

}
