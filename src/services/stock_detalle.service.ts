import { WinstonAdapter } from "../config";
import { prisma } from "../data/postgres";
import { CreateStockDetalleDto, UpdateStockDeatlleDto, CustomError, PaginationDto } from "../dominio";


export class StockDetalleService {

    constructor(
        private readonly logger: WinstonAdapter
    ) { }

    async createDetalleStock(createStockDetalleDto: CreateStockDetalleDto) {

        this.logger.mostrarInfo(`Ingresando el detalle del stock ${createStockDetalleDto.stock_id} con una cantidad de ${createStockDetalleDto.cantidad_ingresada}`);

        try {
            const stockDetalle = await prisma.stock_detalle.create({
                data: createStockDetalleDto
            });

            return {
                stockDetalle,
                msg: "Detalle del stock creado exitosamente"
            };

        } catch (error) {
            throw CustomError.internalServerError(`Error de servidor: ${error}`);
        }

    }

    async getDetallesStock(paginationDto: PaginationDto) {

        this.logger.mostrarInfo("Obteniendo los detalles del stock disponibles");

        const { page, limit } = paginationDto;

        try {
            const [total, detalle_stock] = await Promise.all([
                prisma.stock_detalle.count(),
                prisma.stock_detalle.findMany({
                    skip: (page - 1) * limit,
                    take: limit
                })
            ]);

            return {
                total,
                page,
                limit,
                detalle_stock,
                msg: "Detalles del stock recuperados con exito"
            }

        } catch (error) {
            CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    async getDetalleStock(id: number) {

        this.logger.mostrarInfo(`Obteniendo el detalle del stock ${id}`);

        try {
            const detalleStock = await prisma.stock_detalle.findUnique({
                where: {
                    id
                }
            });
            if (!detalleStock) throw CustomError.notFoundError(`No se encuentra un detalle del stock con el id ${id}`);

            return {
                detalleStock,
                msg: "Detalle stock encontrado exitosamente"
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
            }
        }
    }

    async updateDetalleStock(updateStockDetalleDto: UpdateStockDeatlleDto) {
        const detalleStock = await prisma.stock_detalle.findUnique({
            where: {
                id: updateStockDetalleDto.id
            }
        });
        if (!detalleStock) throw CustomError.notFoundError(`No se encuentra un detalle con el id ${updateStockDetalleDto.id}`);
        try {

            const detalleStockActualizado = await prisma.stock_detalle.update({
                where: { id: updateStockDetalleDto.id },
                data: updateStockDetalleDto
            });

            return {
                detalle_stock: detalleStockActualizado,
                msg: "El detalle ha sido actualizado con exito"
            }
        } catch (error) {
            throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    async deleteDetalleStock(id: number) {

        try {

            const detalleStock = await prisma.stock_detalle.findUnique({
                where: {
                    id
                }
            })
            if (!detalleStock) throw CustomError.notFoundError(`No se encuentra el detalle stock con el id ${id}`);

            const detalleStockEliminado = await prisma.stock_detalle.delete({
                where: {
                    id
                }
            });

            return {
                eliminado: true,
                detalle_stock: detalleStock,
                msg: "Detalle stock eliminado con exito"
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
            }
        }

    }

}