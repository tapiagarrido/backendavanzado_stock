import { Request, Response } from "express";
import { CreateLineaDto, CustomError, PaginationDto, UpdateLineaDto } from "../../dominio";
import { LineaService } from "../../services/linea.service";


export class LineaController {

    constructor(
        private readonly lineaService: LineaService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: 'Internal server Error' });
    }

    createLinea = async (req: Request, res: Response) => {
        const { id: usuarioId } = req.body.usuario;
        const [error, createLineaDto] = CreateLineaDto.create({ ...req.body, usuario_id: usuarioId });
        if (error) return res.status(400).json(error);

        this.lineaService.createLinea(createLineaDto!)
            .then(linea => res.status(201).json(linea))
            .catch(error => this.handleError(error, res));
    }

    getLineas = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json(error);

        this.lineaService.getLineas(paginationDto!)
            .then(lineas => res.status(200).json(lineas))
            .catch(error => this.handleError(error, res));
    }

    getLineaById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        this.lineaService.getLinea(+id)
            .then(linea => res.status(200).json(linea))
            .catch(error => this.handleError(error, res));
    }

    updateLinea = async (req: Request, res: Response) => {
        const { id: usuarioId } = req.body.usuario;
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        const [error, updateLineaDto] = UpdateLineaDto.create({ ...req.body,id:+id, usuario_id: usuarioId });
        if (error) return res.status(400).json(error);

        this.lineaService.updateLinea(updateLineaDto!)
            .then(linea => res.status(201).json(linea))
            .catch(error => this.handleError(error, res));
    }

    deleteLinea = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        this.lineaService.deleteLinea(+id)
            .then(linea => res.status(200).json(linea))
            .catch(error => this.handleError(error, res));
    }

}