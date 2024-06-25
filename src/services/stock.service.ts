import { WinstonAdapter } from "../config";
import { prisma } from "../data/postgres";
import { CreateStockDto, CustomError, PaginationDto, UpdateStockDeatlleDto, UpdateStockDto } from "../dominio";
import { StockDetalleService } from "./stock_detalle.service";


export class StockService {

    constructor(
        private readonly stockDetalleService: StockDetalleService,
        private readonly logger: WinstonAdapter
    ) { }

    async createStock(createStockDto: CreateStockDto) {
        this.logger.mostrarInfo(`Iniciando creación de stock para producto con codigo ${createStockDto.codigo_barra}`);
        const maestraArticuloExiste = await prisma.maestra_articulo.findFirst({where:{codigo_barra: createStockDto.codigo_barra}});
        if(!maestraArticuloExiste) throw CustomError.badRequestError("No se encuentra el producto con el codigo ingresado");
        const stockExiste = await prisma.stock.findFirst({ where: { maestra_articulo_id: maestraArticuloExiste.id } });
        if (stockExiste) throw CustomError.badRequestError("Ya se ha ingresado el producto al stock, debe actualizar");

        let arreglo_detalle_stock = [];
        const { stock_detalle, usuario_id,codigo_barra, ...dataStock } = createStockDto;
        try {
            const stock = await prisma.stock.create({
                data: {maestra_articulo_id: maestraArticuloExiste.id, ...dataStock}
            });

            if (!stock.id) throw CustomError.badRequestError("No se ha podido ingrear el stock");
            if (stock_detalle.length < 1) throw CustomError.badRequestError("No existe detalle del stock");

            this.logger.mostrarInfo(`Iniciando ingreso de stock detalle para stock encabezado id ${stock.id}`);

            for (const detalle of stock_detalle) {
                const detalleCreado = await this.stockDetalleService.createDetalleStock({ ...detalle, stock_id: stock.id, usuario_id });
                arreglo_detalle_stock.push(detalleCreado)
            }

            this.logger.mostrarInfo(`finalizando exitosamente`);

            return {
                stock: {
                    ...stock, arreglo_detalle_stock
                },
                msg: "Stock creado exitosamente"
            };

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
            }
        }
    }

    async getStocks(paginationDto: PaginationDto) {

        this.logger.mostrarInfo("Obteniendo los stocks encabezados disponibles");

        const { page, limit } = paginationDto;

        try {
            const [total, stocks] = await Promise.all([
                prisma.stock.count(),
                prisma.stock.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        maestra_articulo: {
                            select: {
                                nombre: true,
                                descripcion: true,
                                marca: true,
                                valor: true,
                                codigo_barra: true
                            }
                        }
                    }
                })
            ]);

            return {
                total,
                page,
                limit,
                stocks,
                msg: "Stocks obtenidos exitosamente"
            }

        } catch (error) {
            throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    async getStock(id: number) {
        this.logger.mostrarInfo(`Obteniendo stock con id ${id}`);

        try {

            const stockConDetalle = await prisma.stock.findUnique({
                where: {
                    id
                },
                include: {
                    stock_detalle: {
                        where: {
                            stock_id: id
                        }
                    },
                    maestra_articulo: {
                        select: {
                            nombre: true,
                            descripcion: true,
                            marca: true,
                            valor: true,
                            codigo_barra: true
                        }
                    }
                }
            });
            if (!stockConDetalle) throw CustomError.notFoundError(`No se encuentra un stock con el id ${id}`);

            return {
                stock: stockConDetalle,
                msg: "Stock con detalles encontrado exitosamente"
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
            }
        }
    }

    async updateStock(updateStockDto: UpdateStockDto) {

        this.logger.mostrarInfo(`Buscando informacion del stock con id: ${updateStockDto.id}`);

        let arreglo_stock_detalle = [];

        const stockExiste = await prisma.stock.findUnique({
            where: {
                id: updateStockDto.id
            }
        });

        if (!stockExiste) throw CustomError.badRequestError(`No se encuentra información del stock con id ${updateStockDto.id}`);

        const { stock_detalle, id, usuario_id, ...dataStock } = updateStockDto;

        // Almacenamos la cantidad total del encabezado para modificar en caso de que se agreguen campos nuevos al detalle o se modifique el mismo
        let cantidad_total_actual = stockExiste.cantidad_total;

        try {

            if (stock_detalle && stock_detalle?.length > 0) {

                for (const detalle of stock_detalle) {

                    if (detalle.id) {
                        this.logger.mostrarInfo(`Actualizando informacion del stock detalle con id: ${detalle.id}`);

                        const detalleExiste = await prisma.stock_detalle.findUnique({
                            where: {
                                id: detalle.id
                            }
                        });

                        let cantidad_ingresada_previa = detalleExiste?.cantidad_ingresada;

                        const { cantidad_ingresada, cantidad_merma, cantidad_vendida, ...dataDetalle } = detalle;
                        /**Verificamos que los valores actualizados de merma o vendidos no sean mayores a lo ingresado */
                        if ((cantidad_merma! + cantidad_vendida!) <= cantidad_ingresada) {

                            if (cantidad_ingresada_previa! !== cantidad_ingresada) {
                                //Si las validaciones pasan y comprobamos que las cantidades ingresadas variaron, cambiaremos los valores de cantidad_ingresada por si modificaron esta
                                cantidad_total_actual -= cantidad_ingresada_previa!;
                                cantidad_total_actual += cantidad_ingresada;
                            };

                            const detalle_actualizado = await prisma.stock_detalle.update({
                                where: {
                                    id: dataDetalle.id
                                },
                                data: { cantidad_ingresada, cantidad_merma, cantidad_vendida, ...dataDetalle }
                            });

                            arreglo_stock_detalle.push(detalle_actualizado);
                        }
                    } else {
                        this.logger.mostrarInfo(`Ingresando informacion del stock detalle`);

                        /**Se quitan campos que no sirven en el crear */
                        const { stock_id, id, usuario_id, ...dataDetalle } = detalle;
                        const detalle_ingresado = await prisma.stock_detalle.create({
                            data: { stock_id: updateStockDto.id, usuario_id: updateStockDto.usuario_id!, ...dataDetalle }
                        });
                        arreglo_stock_detalle.push(detalle_ingresado);
                    }
                }
            };

            this.logger.mostrarInfo(`Actualizando informacion del stock encabezado con id: ${updateStockDto.id}`);

            const stockActualizado = await prisma.stock.update({
                where: {
                    id: id
                },
                data: { cantidad_total: cantidad_total_actual, ...dataStock }
            });


            this.logger.mostrarInfo(`Finaliza proceso de actualización`);

            return {
                stock: {
                    ...stockActualizado, detalle_stock: arreglo_stock_detalle
                },
                msg: "Stock actualizado exitosamente"
            };

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
            }
        }
    }

    async deleteStock(idEncab: number, idDetalle?: number) {

        const stockEncab = await prisma.stock.findUnique({
            where: {
                id: idEncab
            }
        });

        if (!stockEncab) throw CustomError.badRequestError("No se encuentran datos del stock");

        try {
            if (idDetalle) {
                const stockDetalle = await prisma.stock_detalle.findUnique({
                    where: {
                        id: idDetalle
                    }
                });

                if (!stockDetalle) throw CustomError.badRequestError(`No se encuentra el detalle ${idDetalle} en el stock con id ${idEncab}`);
                if (stockDetalle.stock_id !== stockEncab.id) throw CustomError.badRequestError("Este detalle no pertenece al stock indicado");

                const detalle_eliminado = await prisma.stock_detalle.delete({
                    where: {
                        id: idDetalle
                    }
                });

                const { cantidad_total, ...dataEncab } = stockEncab;
                const cantidad_total_actualizada = cantidad_total - detalle_eliminado.cantidad_ingresada;

                const stockActualizado = await prisma.stock.update({
                    where: {
                        id: idEncab
                    },
                    data: { cantidad_total: cantidad_total_actualizada, ...dataEncab }
                });

                return {
                    stock: { encabezado: stockActualizado, detalle_eliminado: detalle_eliminado },
                    msg: `El detalle con id ${idDetalle} ha sido eliminado y el stock ha sido actualizado`
                }
            } {
                const detalles_eliminados = await prisma.stock_detalle.deleteMany({
                    where: {
                        stock_id: idEncab
                    }
                });

                const encabezado_eliminado = await prisma.stock.delete({
                    where: {
                        id: idEncab
                    }
                });
                return {
                    stock: { encabezado: encabezado_eliminado, detalle_eliminado: detalles_eliminados },
                    msg: `El stock y sus detalles han sido eliminados`
                }
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