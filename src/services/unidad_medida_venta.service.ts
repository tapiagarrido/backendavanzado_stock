import { WinstonAdapter } from "../config";
import { prisma } from "../data/postgres";
import { CreateUnidadMedidaVentaDto, CustomError, PaginationDto, UpdateUnidadMedidaVentaDto } from "../dominio";


export class UnidadMedidaVentaService {

    constructor(
        private readonly logger: WinstonAdapter
    ) { }

    async createUnidadMedidaVenta(createUnidadMedidaVentaDto: CreateUnidadMedidaVentaDto) {

        this.logger.mostrarInfo("Comenzando creacion de nueva unidad de medida");

        const unidadMedidaVentaExiste = await prisma.unidad_medida_venta.findFirst({ where: { nombre: createUnidadMedidaVentaDto.nombre } });
        if (unidadMedidaVentaExiste) throw CustomError.badRequestError("El nombre ingresado en la unidad de medida ya esta registrado");

        try {
            const unidadMedidaVenta = await prisma.unidad_medida_venta.create({
                data: createUnidadMedidaVentaDto
            })

            return {
                unidad_medida_venta: unidadMedidaVenta,
                msg: "Unidad de medida Creada exitosamente"
            };

        } catch (error) {
            throw CustomError.internalServerError(`Error de servidor: ${error}`);
        }

    }

    async getUnidadesMedidaVenta(paginationDto: PaginationDto) {

        this.logger.mostrarInfo("Obteniendo unidades de medida disponibles");

        const { page, limit } = paginationDto;

        try {
            const [total, unidadesMedidaVenta] = await Promise.all([
                prisma.unidad_medida_venta.count(),
                prisma.unidad_medida_venta.findMany({
                    skip: (page - 1) * limit,
                    take: limit

                })
            ]);

            return {
                total,
                page,
                limit,
                unidadesMedidaVenta,
                msg: "Unidades de medida obtenidas exitosamente"
            }

        } catch (error) {
            CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    async getUnidadMedidaVenta(id: number) {

        this.logger.mostrarInfo(`Obteniendo Unidad de medida con id ${id}`);

        try {
            const unidadMedidaVenta = await prisma.unidad_medida_venta.findUnique({
                where: {
                    id
                }
            });
            if (!unidadMedidaVenta) throw CustomError.notFoundError(`No se encuentra una unidad de medida con el id ${id}`);

            return {
                unidadMedidaVenta,
                msg: "Unidad de medida encontrada exitosamente"
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
            }
        }
    }

    async updateUnidadMedidaVenta(updateUnidadMedidaVentaDto: UpdateUnidadMedidaVentaDto) {

        this.logger.mostrarInfo(`Actualizando informacion de la unidad de medida con id: ${updateUnidadMedidaVentaDto.id}`);

        const { id, nombre } = updateUnidadMedidaVentaDto;

        const unidadMedidaVenta = await prisma.unidad_medida_venta.findUnique({
            where: {
                id: id
            }
        });
        if (!unidadMedidaVenta) throw CustomError.notFoundError(`No se encuentra una unidad de medida con el id ${updateUnidadMedidaVentaDto.id}`);

        try {
            const unidadMedidaVentaActualizada = await prisma.unidad_medida_venta.update({
                where: { id },
                data: { nombre }
            });

            return {
                unidad_medida_venta: unidadMedidaVentaActualizada,
                msg: "Unidad de medida ha sido actualizada exitosamente"
            }

        } catch (error) {
            throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    async deleteUnidadMedidaVenta(id: number) {

        this.logger.mostrarInfo(`Eliminando Unidad de medida con id: ${id}`);

        try {

            const unidadMedidaVenta = await prisma.unidad_medida_venta.findUnique({
                where: {
                    id
                }
            })
            if (!unidadMedidaVenta) throw CustomError.notFoundError(`No se encuentra una unidad de medida con el id ${id}`);

            const unidadMedidaVentaEliminada = await prisma.unidad_medida_venta.delete({
                where: {
                    id
                }
            });

            return {
                eliminado: true,
                unidad_medida_venta: unidadMedidaVentaEliminada,
                msg: "Unidad de medida eliminada con exito"
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