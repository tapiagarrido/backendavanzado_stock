import { Request, Response } from "express";
import { CategoriaService } from "../../services/categoria.service";
import { CreateCategoriaDto, CustomError, PaginationDto } from "../../dominio";
import { UpdateCategoriaDto } from "../../dominio/dtos/categoria/update-categoria.dto";


export class CategoriaController {


    constructor(
        private readonly categoriaService: CategoriaService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: 'Internal server Error' });
    }

    createCategoria = async (req: Request, res: Response) => {
        const { id: usuarioId } = req.body.usuario;
        const [error, createCategoriaDto] = CreateCategoriaDto.create({ ...req.body, usuario_id: usuarioId });
        if (error) return res.status(400).json(error);

        this.categoriaService.createCategoria(createCategoriaDto!)
            .then(categoria => res.status(201).json(categoria))
            .catch(error => this.handleError(error, res));
    }

    getCategorias = async (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.categoriaService.getCategorias(paginationDto!)
            .then(categorias => res.status(200).json(categorias))
            .catch(error => this.handleError(error, res));

    }

    getCategoriaById = async (req: Request, res: Response) => {

        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        this.categoriaService.getCategoria(+id)
            .then(categoria => res.status(200).json(categoria))
            .catch(error => this.handleError(error, res));
    }

    updateCategoria = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { id: usuarioId } = req.body.usuario;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        const [error, updateCategoriaDto] = UpdateCategoriaDto.create({ ...req.body, id: +id, usuario_id: usuarioId });
        if (error) return res.status(400).json(error);

        this.categoriaService.updateCategoria(updateCategoriaDto!)
            .then(categoria => res.status(201).json(categoria))
            .catch(error => this.handleError(error, res));
    }

    deleteCategoria = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        this.categoriaService.deleteCategoria(+id)
            .then(categoria => res.status(200).json(categoria))
            .catch(error => this.handleError(error, res));
    }
}