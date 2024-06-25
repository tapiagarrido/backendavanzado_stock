import { prisma } from "../data/postgres";
import { CreateCategoriaDto, CustomError, PaginationDto,UpdateCategoriaDto } from "../dominio";

export class CategoriaService {

    constructor(

    ) { }

    async createCategoria(createCategoriaDto: CreateCategoriaDto) {

        const categoriaExiste = await prisma.categoria.findFirst({ where: { nombre: createCategoriaDto.nombre } });
        if (categoriaExiste) throw CustomError.badRequestError("El nombre ingresado a la categoria ya esta registrado");

        try {
            const categoria = await prisma.categoria.create({
                data: createCategoriaDto
            })

            return {
                categoria,
                msg: "Categoria creada exitosamente"
            };

        } catch (error) {
            throw CustomError.internalServerError(`Error de servidor: ${error}`);
        }

    }

    async getCategorias(paginationDto: PaginationDto) {

        const { page, limit } = paginationDto;

        try {
            const [total, categorias] = await Promise.all([
                prisma.categoria.count(),
                prisma.categoria.findMany({
                    skip: (page - 1) * limit,
                    take: limit

                })
            ]);

            return {
                total,
                page,
                limit,
                categorias,
                msg: "Categorias encontradas con exito"
            }

        } catch (error) {
            CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    async getCategoria(id: number) {

        try {
            const categoria = await prisma.categoria.findUnique({
                where: {
                    id
                }
            });
            if (!categoria) throw CustomError.notFoundError(`No se encuentra una categoria con el id ${id}`);

            return {
                categoria,
                msg: "Categoria encontrada exitosamente"
            }
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
            }
        }
    }

    async updateCategoria(updateCategoriaDto: UpdateCategoriaDto) {
        const { id, nombre, descripcion, usuario_id } = updateCategoriaDto;
        const categoria = await prisma.categoria.findUnique({
            where: {
                id: id
            }
        });
        if (!categoria) throw CustomError.notFoundError(`No se encuentra una categoria con el id ${updateCategoriaDto.id}`);
        try {


            const categoriaActualizada = await prisma.categoria.update({
                where: { id },
                data: { nombre, descripcion, usuario_id }
            });

            return {
                categoria: categoriaActualizada,
                msg: "Categoria ha sido actualizada con exito"
            }
        } catch (error) {
            throw CustomError.internalServerError(`Algo ha salido mal: ${error}`);
        }
    }

    async deleteCategoria(id: number) {

        try {

            const categoria = await prisma.categoria.findUnique({
                where: {
                    id
                }
            })
            if (!categoria) throw CustomError.notFoundError(`No se encuentra una categoria con el id ${id}`);

            const categoriaElminada = await prisma.categoria.delete({
                where: {
                    id
                }
            });

            return {
                eliminado: true,
                categoria: categoriaElminada,
                msg: "Categoria eliminada con exito"
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