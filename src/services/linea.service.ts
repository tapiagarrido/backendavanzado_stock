import { WinstonAdapter } from "../config";
import { prisma } from "../data/postgres";
import { CreateLineaDto, CustomError, PaginationDto, UpdateLineaDto } from "../dominio";


export class LineaService{

    constructor(
        private readonly logger:WinstonAdapter
    ){}

    async createLinea(createLineaDto: CreateLineaDto) {

        this.logger.mostrarInfo("Comenzando creacion de nueva linea");

        const lineaExiste = await prisma.linea.findFirst({ where: { nombre: createLineaDto.nombre } });
        if (lineaExiste) throw CustomError.badRequestError("El nombre ingresado en la linea ya esta registrado");

        try {
            const linea = await prisma.linea.create({
                data: createLineaDto
            })

            return {
                linea,
                msg: "Linea Creada exitosamente"
            };

        } catch (error) {
            throw CustomError.internalServerError(`Error de servidor: ${error}`);
        }

    }

    async getLineas(paginationDto: PaginationDto) {

        this.logger.mostrarInfo("Obteniendo lineas disponibles");

        const { page, limit } = paginationDto;

        try {
            const [total, lineas] = await Promise.all([
                prisma.linea.count(),
                prisma.linea.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        usuario: {
                            select: {
                                alias: true,
                                nombre_completo: true
                            }
                        }
                    }
                })
            ]);

            return {
                total,
                page,
                limit,
                lineas,
                msg: "Lineas encontradas con exito"
            }

        } catch (error) {
            throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    async getLinea(id: number) {

        this.logger.mostrarInfo(`Obteniendo linea con id ${id}`);

        try {
            const linea = await prisma.linea.findUnique({
                where: {
                    id
                },
                include: {
                    usuario: {
                        select: {
                            alias: true,
                            nombre_completo: true
                        }
                    }
                }
            });
            if (!linea) throw CustomError.notFoundError(`No se encuentra una linea con el id ${id}`);

            return {
                linea,
                msg: "Linea encontrada exitosamente"
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
            }
        }
    }

    async updateLinea(updateLineaDto: UpdateLineaDto) {

        this.logger.mostrarInfo(`Actualizando informacion de la linea con id: ${updateLineaDto.id}`);

        const { id, nombre, descripcion, usuario_id } = updateLineaDto;

        const linea = await prisma.linea.findUnique({
            where: {
                id: id
            }
        });
        if (!linea) throw CustomError.notFoundError(`No se encuentra una linea con el id ${updateLineaDto.id}`);

        try {
            const lineaActualizada = await prisma.linea.update({
                where: { id },
                data: { nombre, descripcion, usuario_id }
            });

            return {
                linea: lineaActualizada,
                msg: "Linea ha sido actualizada exitosamente"
            }

        } catch (error) {
            throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    async deleteLinea(id: number) {

        this.logger.mostrarInfo(`Eliminando linea con id: ${id}`);

        try {

            const linea = await prisma.linea.findUnique({
                where: {
                    id
                }
            })
            if (!linea) throw CustomError.notFoundError(`No se encuentra una linea con el id ${id}`);

            const lineaEliminada = await prisma.linea.delete({
                where: {
                    id
                }
            });

            return {
                eliminado: true,
                linea: lineaEliminada,
                msg: "Linea eliminada con exito"
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