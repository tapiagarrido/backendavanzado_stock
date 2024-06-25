import { WinstonAdapter } from "../config";
import { prisma } from "../data/postgres";
import { CreateTipoDto, UpdateTipoDto, CustomError, PaginationDto } from "../dominio";


export class TipoService {

    constructor(
        private readonly logger: WinstonAdapter
    ) { }

    async createTipo(createTipoDto: CreateTipoDto) {

        const tipoExiste = await prisma.tipo.findFirst({ where: { nombre: createTipoDto.nombre } });
        if (tipoExiste) throw CustomError.badRequestError("El nombre ingresado en el tipo ya esta registrado");

        try {
            const tipo = await prisma.tipo.create({
                data: createTipoDto
            })

            return {
                tipo,
                msg: "Tipo creado exitosamente"
            };

        } catch (error) {
            throw CustomError.internalServerError(`Error de servidor: ${error}`);
        }

    }

    async getTipos(paginationDto: PaginationDto) {

        this.logger.mostrarInfo("Obteniendo los tipos disponibles");

        const { page, limit } = paginationDto;

        try {
            const [total, tipos] = await Promise.all([
                prisma.tipo.count(),
                prisma.tipo.findMany({
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
                tipos,
                msg: "Tipos encontrados con exito"
            }

        } catch (error) {
            CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    async getTipo(id: number) {

        try {
            const tipo = await prisma.tipo.findUnique({
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
            if (!tipo) throw CustomError.notFoundError(`No se encuentra un tipo con el id ${id}`);

            return {
                tipo,
                msg: "Tipo encontrado exitosamente"
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
            }
        }
    }

    async updateTipo(updateTipoDto: UpdateTipoDto) {
        const { id, nombre, descripcion, usuario_id } = updateTipoDto;
        const tipo = await prisma.tipo.findUnique({
            where: {
                id: id
            }
        });
        if (!tipo) throw CustomError.notFoundError(`No se encuentra un tipo con el id ${updateTipoDto.id}`);
        try {

            const tipoActualizado = await prisma.tipo.update({
                where: { id },
                data: { nombre, descripcion, usuario_id }
            });

            return {
                tipo: tipoActualizado,
                msg: "Tipo ha sido actualizado con exito"
            }
        } catch (error) {
            throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    async deleteTipo(id: number) {

        try {

            const tipo = await prisma.tipo.findUnique({
                where: {
                    id
                }
            })
            if (!tipo) throw CustomError.notFoundError(`No se encuentra un tipo con el id ${id}`);

            const tipoEliminado = await prisma.tipo.delete({
                where: {
                    id
                }
            });

            return {
                eliminado: true,
                tipo: tipoEliminado,
                msg: "Tipo eliminado con exito"
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