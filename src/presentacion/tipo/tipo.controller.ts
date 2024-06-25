import { Request, Response } from "express";
import { TipoService } from "../../services/tipo.service";
import { CreateTipoDto,UpdateTipoDto, CustomError, PaginationDto } from "../../dominio";


//Todo: recuerda agregar el usuario de manera dinamica


export class TipoController {


    constructor(
        private readonly tipoService: TipoService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: 'Internal server Error' });
    }

    createTipo = async (req: Request, res: Response) => {
        const { id:usuarioId } = req.body.usuario
        const [error, createTipoDto] = CreateTipoDto.create({ ...req.body, usuario_id: usuarioId });
        if (error) return res.status(400).json(error);

        this.tipoService.createTipo(createTipoDto!)
            .then(tipo => res.status(201).json(tipo))
            .catch(error => this.handleError(error, res));
    }

    getTipos = async (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.tipoService.getTipos(paginationDto!)
            .then(tipos => res.status(200).json(tipos))
            .catch(error => this.handleError(error, res));

    }

    getTipoById = async (req: Request, res: Response) => {

        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        this.tipoService.getTipo(+id)
            .then(tipo => res.status(200).json(tipo))
            .catch(error => this.handleError(error, res));
    }

    updateTipo = async (req: Request, res: Response) => {
        const { id:usuarioId } = req.body.usuario
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        const [error, updateTipoDto] = UpdateTipoDto.create({ ...req.body, id: +id, usuario_id: usuarioId });
        if (error) return res.status(400).json(error);

        this.tipoService.updateTipo(updateTipoDto!)
            .then(tipo => res.status(201).json(tipo))
            .catch(error => this.handleError(error, res));
    }

    deleteTipo = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        this.tipoService.deleteTipo(+id)
            .then(tipo => res.status(200).json(tipo))
            .catch(error => this.handleError(error, res));
    }
}