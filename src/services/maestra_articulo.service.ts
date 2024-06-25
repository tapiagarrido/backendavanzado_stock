import { maestra_articulo } from "@prisma/client";
import { WinstonAdapter } from "../config";
import { prisma } from "../data/postgres";
import { CreateMaestraArticuloDto, CustomError, PaginationDto, UpdateMaestraArticuloDto } from "../dominio";
import { MaestraArticuloEntity } from "../dominio/entities/maestra-articulo.entity";


export class MaestraArticuloService {

    constructor(
        private readonly logger: WinstonAdapter
    ) { }


    async createArticulo(createMaestraArticuloDto: CreateMaestraArticuloDto) {

        this.logger.mostrarInfo("Comenzando creacion de nuevo articulo");

        const existeMaestraArticulo = await prisma.maestra_articulo.findFirst({ where: { nombre: createMaestraArticuloDto.nombre } });
        if (existeMaestraArticulo) throw CustomError.badRequestError("El nombre del articulo ya se encuentra registrado");

        try {

            const articulo = await prisma.maestra_articulo.create({
                data: createMaestraArticuloDto
            });
            const { id, ...nuevoArticulo } = MaestraArticuloEntity.fromObject(articulo);

            return {
                articulo: nuevoArticulo,
                msg: "Se ha registrao el articulo exitosamente"
            }

        } catch (error) {
            throw CustomError.internalServerError(`Ha ocurrido un error: ${error}`)
        }

    }

    async getArticulos(paginationDto: PaginationDto) {
        this.logger.mostrarInfo("Comenzando busqueda de articulos registrados");

        const { page, limit } = paginationDto;

        try {
            const [total, articulos] = await Promise.all([
                prisma.maestra_articulo.count(),
                prisma.maestra_articulo.findMany({
                    skip: (page - 1) * limit,
                    take: limit,
                    include: {
                        tipo: {
                            select: {
                                nombre: true
                            }
                        },
                        linea: {
                            select: {
                                nombre: true
                            }
                        },
                        local: {
                            select: {
                                nombre: true
                            }
                        },
                        unidad_medida_venta: {
                            select: {
                                nombre: true
                            }
                        },
                        usuario: {
                            select: {
                                nombre_completo: true,
                                alias: true
                            }
                        }
                    }
                })
            ]);

            return {
                total,
                page,
                limit,
                articulos,
                msg: "Articulos encontrados con exito"
            }

        } catch (error) {
            CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }

    }

    async getArticulo(id: number) {
        this.logger.mostrarInfo("Comenzando busqueda de un articulo");

        try {
            const articulo = await prisma.maestra_articulo.findUnique({
                where: {
                    id: id
                },
                include: {
                    tipo: {
                        select: {
                            nombre: true
                        }
                    },
                    linea: {
                        select: {
                            nombre: true
                        }
                    },
                    local: {
                        select: {
                            nombre: true
                        }
                    },
                    unidad_medida_venta: {
                        select: {
                            nombre: true
                        }
                    },
                    usuario: {
                        select: {
                            nombre_completo: true,
                            alias: true
                        }
                    }
                }
            });
            if (!articulo) throw CustomError.notFoundError(`No se encuentra un articulo con el id ${id}`);

            return {
                articulo,
                msg: "Articulo encontrado con exito"
            }

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
            }
        }
    }

    async searchArticulo(nombre: string) {
        this.logger.mostrarInfo(`Buscando el producto ${nombre}`);

        try {
            let articulos: maestra_articulo[];
            let total;

            if (nombre.length === 0) {
                articulos = [];
                total = 0;
            } else {
                [articulos, total] = await Promise.all([
                    prisma.maestra_articulo.findMany({
                        where: {
                            nombre: {
                                contains: nombre
                            }
                        }
                    }),
                    prisma.maestra_articulo.count()
                ]);
            }
            return {
                articulos,
                msg: `Busqueda finalizada, se encontraron ${total} resultados`
            }

        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
            }
        }
    }

    async updateArticulo(updateMaestraArticuloDto: UpdateMaestraArticuloDto) {
        this.logger.mostrarInfo("Comenzando actualización de un articulo");

        const articulo = await prisma.maestra_articulo.findFirst({
            where: {
                id: updateMaestraArticuloDto.id
            }
        });
        if (!articulo) throw CustomError.notFoundError(`No se encuentra un articulo con el id ${updateMaestraArticuloDto.id}`);
        try {
            const articuloActualizado = await prisma.maestra_articulo.update({
                where: { id: updateMaestraArticuloDto.id },
                data: updateMaestraArticuloDto
            });

            const { id, ...articuloActualizadoObjeto } = MaestraArticuloEntity.fromObject(articuloActualizado);

            return {
                articulo: articuloActualizadoObjeto,
                msg: "Articulo ha sido actualizado con exito"
            }
        } catch (error) {
            throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    async deleteArticulo(id: number) {
        this.logger.mostrarInfo("Comenzando eliminación de un articulo");

        try {
            const articulos = await prisma.maestra_articulo.findFirst({
                where: {
                    id
                }
            })
            if (!articulos) throw CustomError.notFoundError(`No se encuentra un articulo con el id ${id}`);

            const articuloEliminado = await prisma.maestra_articulo.delete({
                where: {
                    id
                }
            });

            return {
                eliminado: true,
                articulo: articuloEliminado,
                msg: "Articulo eliminado con exito"
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