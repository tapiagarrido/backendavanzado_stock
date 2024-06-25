import { WinstonAdapter } from "../config";
import { prisma } from "../data/postgres";
import { CreateLocalDto, CustomError, PaginationDto, UpdateLocalDto } from "../dominio";


export class LocalService{

    constructor(
        private readonly logger:WinstonAdapter
    ){}

    async createLocal(createLocalDto: CreateLocalDto) {

        this.logger.mostrarInfo("Comenzando creacion de nuevo local");

        const localExiste = await prisma.local.findFirst({ where: { nombre: createLocalDto.nombre } });
        if (localExiste) throw CustomError.badRequestError("El nombre ingresado en el local ya esta registrado");

        try {
            const local = await prisma.local.create({
                data: createLocalDto
            })

            return {
                local,
                msg: "Local Creado exitosamente"
            };

        } catch (error) {
            throw CustomError.internalServerError(`Error de servidor: ${error}`);
        }

    }

    async getLocales(paginationDto: PaginationDto) {

        this.logger.mostrarInfo("Obteniendo locales disponibles");

        const { page, limit } = paginationDto;

        try {
            const [total, locales] = await Promise.all([
                prisma.local.count(),
                prisma.local.findMany({
                    skip: (page - 1) * limit,
                    take: limit

                })
            ]);

            return {
                total,
                page,
                limit,
                locales,
                msg: "Locales obtenidos exitosamente"
            }

        } catch (error) {
            CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    async getLocal(id: number) {

        this.logger.mostrarInfo(`Obteniendo local con id ${id}`);

        try {
            const local = await prisma.local.findUnique({
                where: {
                    id
                }
            });
            if (!local) throw CustomError.notFoundError(`No se encuentra un local con el id ${id}`);

            return {
                local,
                msg: "Local encontrado exitosamente"
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
            }
        }
    }

    async updateLocal(updateLocalDto: UpdateLocalDto) {

        this.logger.mostrarInfo(`Actualizando informacion del local con id: ${updateLocalDto.id}`);

        const { id, nombre, descripcion } = updateLocalDto;

        const local = await prisma.local.findUnique({
            where: {
                id: id
            }
        });
        if (!local) throw CustomError.notFoundError(`No se encuentra un local con el id ${updateLocalDto.id}`);

        try {
            const localActualizado = await prisma.local.update({
                where: { id },
                data: { nombre, descripcion }
            });

            return {
                local: localActualizado,
                msg: "Local ha sido actualizado exitosamente"
            }

        } catch (error) {
            throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    async deleteLocal(id: number) {

        this.logger.mostrarInfo(`Eliminando local con id: ${id}`);

        try {

            const local = await prisma.local.findUnique({
                where: {
                    id
                }
            })
            if (!local) throw CustomError.notFoundError(`No se encuentra un local con el id ${id}`);

            const localEliminado = await prisma.local.delete({
                where: {
                    id
                }
            });

            return {
                eliminado: true,
                local: localEliminado,
                msg: "Local eliminado con exito"
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