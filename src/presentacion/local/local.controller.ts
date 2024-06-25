import { Request, Response } from "express";
import { CreateLocalDto, CustomError, PaginationDto, UpdateLocalDto } from "../../dominio";
import { LocalService} from "../../services/local.service";


export class LocalController {

    constructor(
        private readonly localService: LocalService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: 'Internal server Error' });
    }

    createLocal = async (req: Request, res: Response) => {
        const [error, createLocalDto] = CreateLocalDto.create(req.body);
        if (error) return res.status(400).json(error);

        this.localService.createLocal(createLocalDto!)
            .then(local => res.status(201).json(local))
            .catch(error => this.handleError(error, res));
    }

    getLocales = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json(error);

        this.localService.getLocales(paginationDto!)
            .then(locales => res.status(200).json(locales))
            .catch(error => this.handleError(error, res));
    }

    getLocalById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        this.localService.getLocal(+id)
            .then(local => res.status(200).json(local))
            .catch(error => this.handleError(error, res));
    }

    updateLocal = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        const [error, updateLocalDto] = UpdateLocalDto.create({ ...req.body,id:+id});
        if (error) return res.status(400).json(error);

        this.localService.updateLocal(updateLocalDto!)
            .then(local => res.status(201).json(local))
            .catch(error => this.handleError(error, res));
    }

    deleteLocal = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        this.localService.deleteLocal(+id)
            .then(local => res.status(200).json(local))
            .catch(error => this.handleError(error, res));
    }

}