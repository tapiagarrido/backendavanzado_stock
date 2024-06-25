import { Request, Response } from "express";
import { CreateUnidadMedidaVentaDto, CustomError, PaginationDto, UpdateUnidadMedidaVentaDto } from "../../dominio";
import { UnidadMedidaVentaService} from "../../services/unidad_medida_venta.service";


export class UnidadMedidaVentaController {

    constructor(
        private readonly unidadMedidaVentaService: UnidadMedidaVentaService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: 'Internal server Error' });
    }

    createUnidadMedidaVenta = async (req: Request, res: Response) => {
        const [error, createUnidadMedidaVentaDto] = CreateUnidadMedidaVentaDto.create(req.body);
        if (error) return res.status(400).json(error);

        this.unidadMedidaVentaService.createUnidadMedidaVenta(createUnidadMedidaVentaDto!)
            .then(unidadMedidaVenta => res.status(201).json(unidadMedidaVenta))
            .catch(error => this.handleError(error, res));
    }

    getUnidadesMedidaVenta = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json(error);

        this.unidadMedidaVentaService.getUnidadesMedidaVenta(paginationDto!)
            .then(unidadesMedidaVenta => res.status(200).json(unidadesMedidaVenta))
            .catch(error => this.handleError(error, res));
    }

    getUnidadMedidaVentaById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        this.unidadMedidaVentaService.getUnidadMedidaVenta(+id)
            .then(unidadMedidaVenta => res.status(200).json(unidadMedidaVenta))
            .catch(error => this.handleError(error, res));
    }

    updateUnidadMedidaVenta = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        const [error, updateUnidadMedidaVentaDto] = UpdateUnidadMedidaVentaDto.create({ ...req.body,id:+id});
        if (error) return res.status(400).json(error);

        this.unidadMedidaVentaService.updateUnidadMedidaVenta(updateUnidadMedidaVentaDto!)
            .then(unidadMedidaVenta => res.status(201).json(unidadMedidaVenta))
            .catch(error => this.handleError(error, res));
    }

    deleteUnidadMedidaVenta = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        this.unidadMedidaVentaService.deleteUnidadMedidaVenta(+id)
            .then(unidadMedidaVenta => res.status(200).json(unidadMedidaVenta))
            .catch(error => this.handleError(error, res));
    }

}