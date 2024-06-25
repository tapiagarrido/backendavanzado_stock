import { Request, Response } from "express";
import { CreateMaestraArticuloDto, CustomError, PaginationDto, UpdateMaestraArticuloDto } from "../../dominio";
import { MaestraArticuloService } from "../../services/maestra_articulo.service";


//Todo: recuerda agregar el usuario de manera dinamica


export class MaestraArticuloController {


    constructor(
        private readonly maestraArticuloService: MaestraArticuloService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: 'Internal server Error' });
    }

    createArticulo = async (req: Request, res: Response) => {

        if (!req.body.usuario) return res.status(400).json({ msg: "No hay un usuario registrado" });
        const { id: usuarioId } = req.body.usuario;
        const [error, createMaestraArticuloDto] = CreateMaestraArticuloDto.create({ usuario_id: usuarioId, ...req.body });
        if (error) return res.status(400).json(error);

        this.maestraArticuloService.createArticulo(createMaestraArticuloDto!)
            .then(articulo => res.status(201).json(articulo))
            .catch(error => this.handleError(error, res));
    }

    getArticulos = async (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.maestraArticuloService.getArticulos(paginationDto!)
            .then(articulos => res.status(200).json(articulos))
            .catch(error => this.handleError(error, res));

    }

    getArticuloById = async (req: Request, res: Response) => {

        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        this.maestraArticuloService.getArticulo(+id)
            .then(articulo => res.status(200).json(articulo))
            .catch(error => this.handleError(error, res));
    }

    updateArticulo = async (req: Request, res: Response) => {

        const { id } = req.params;
        if (!req.body.usuario) return res.status(400).json({ msg: "No hay un usuario registrado" });
        const { id: usuarioId } = req.body.usuario;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        const [error, updateMaestraArticuloDto] = UpdateMaestraArticuloDto.create({ ...req.body, id: +id, usuario_id: usuarioId });

        if (error) return res.status(400).json(error);

        this.maestraArticuloService.updateArticulo(updateMaestraArticuloDto!)
            .then(articulo => res.status(201).json(articulo))
            .catch(error => this.handleError(error, res));
    }

    deleteArticulo = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        this.maestraArticuloService.deleteArticulo(+id)
            .then(articulo => res.status(200).json(articulo))
            .catch(error => this.handleError(error, res));
    }

    searchArticulos = async (req: Request, res: Response) => {
        const { nombre } = req.query;
        
        this.maestraArticuloService.searchArticulo(nombre?.toString()!)
            .then(articulos => res.status(200).json(articulos))
            .catch(error => this.handleError(error, res))
    }
}