import axios, { AxiosRequestConfig } from "axios";
import { CreateVentaDto } from "../dominio/dtos/api_venta/create-venta.dto";
import { JwtAdapter, WinstonAdapter, envs } from "../config";
import { CustomError, ErrorAxios, PaginationDto, Venta } from "../dominio";
import { prisma } from "../data/postgres";

export class ApiVentasService {
    constructor(
        private readonly logger: WinstonAdapter,
    ) { }

    private handleError(error: any) {
        if (error.response && error.response.status) {
            const statusCode = error.response.status;
            switch (statusCode) {
                case 400:
                    throw CustomError.badRequestError(error.response.data.error);
                case 403:
                    throw CustomError.unauthorizedError(error.response.data.error);
                case 404:
                    throw CustomError.notFoundError("La venta indicada no existe");
                default:
                    throw CustomError.internalServerError("Error desconocido al llamar a la API de ventas");
            }
        } else {
            throw CustomError.internalServerError(`Error desconocido al llamar a la API de ventas: ${error}`);
        }
    }

    async createVenta(createVentaDto: CreateVentaDto,token:string) {

        this.logger.mostrarInfo("Iniciando comunicación con Api Ventas");

        console.log(createVentaDto)

        const headers: AxiosRequestConfig["headers"] = {
            "X-Secret": envs.API_VENTAS_SECRET,
            "Authorization": token
        }

        try {

            const response = await axios.post(`${envs.API_VENTAS}/ventas/`, createVentaDto, { headers });
            this.logger.mostrarInfo("Esperando Respuesta desde Microservicio");
            const data: Venta = response.data;
            this.logger.mostrarInfo("Se inicia descuento del stock");
            
            if (!data.id) throw CustomError.badRequestError("No se ha completado el registro de la venta");
            
            let stocksActualizados = [];
            console.log(data)

            for (const detalle of data.detalles) {
                const respuestaStock = await this.updateStock(detalle.codigo_barra, detalle.cantidad);
                stocksActualizados.push(respuestaStock);
            }

            return {
                venta: {
                    fecha_venta: data.fecha_venta,
                    detalle: data.detalles
                },
                stock_actualizado: stocksActualizados,
                msg: "Se ha generado la venta y actualización del stock"
            };

        } catch (error) {
            return this.handleError(error)
        }

    }

    async getVentas(paginationDto: PaginationDto,token:string) {

        this.logger.mostrarInfo("Llamando a api_ventas y obteniendo registros");

        const { page, limit } = paginationDto;

        const headers: AxiosRequestConfig["headers"] = {
            "X-Secret": envs.API_VENTAS_SECRET,
            "Authorization": token
        }

        try {

            const response = await axios.get(`${envs.API_VENTAS}/ventas/?page=${page}&page_size=${limit}`, { headers });
            const data = response.data;
            return data;

        } catch (error) {
            return this.handleError(error)
        }
    }

    async getVenta(id: number,token:string) {

        this.logger.mostrarInfo(`Llamando a api_ventas y obteniendo el registro de venta numero ${id}`);
        const headers: AxiosRequestConfig["headers"] = {
            "X-Secret": envs.API_VENTAS_SECRET,
            "Authorization": token
        }

        try {

            const response = await axios.get(`${envs.API_VENTAS}/ventas/${id}`, { headers });
            const data = response.data;
            return data;

        } catch (error) {

            return this.handleError(error);
        }

    }


    private async updateStock(codigo_barra: string, cantidad_venta: number) {
        const articuloExiste = await prisma.maestra_articulo.findFirst({ where: { codigo_barra } });
        if (!articuloExiste) throw CustomError.notFoundError(`No se encuentra el articulo con codigo de barra ${codigo_barra}`);

        const stockExiste = await prisma.stock.findFirst({ where: { maestra_articulo_id: articuloExiste.id } });
        if (!stockExiste) throw CustomError.notFoundError(`No existe stock definido para el articulo codigo de barra ${codigo_barra}`);

        let cantidadActualizada = stockExiste.cantidad_total - cantidad_venta;
        if (cantidadActualizada < 0) cantidadActualizada = 0;

        const stockActualizado = await prisma.stock.update({ where: { id: stockExiste.id }, data: { cantidad_total: cantidadActualizada }, include: { maestra_articulo: true } })

        return {
            articulo: stockActualizado.maestra_articulo.nombre,
            codigo_barra: stockActualizado.maestra_articulo.codigo_barra,
            cantidad_disponible: stockActualizado.cantidad_total
        };
    }
}

