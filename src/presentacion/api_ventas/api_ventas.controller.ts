import { Request, Response } from "express";
import { CustomError, PaginationDto } from "../../dominio";
import { ApiVentasService } from "../../services/api_ventas.service";
import { CreateVentaDto } from "../../dominio/dtos/api_venta/create-venta.dto";


export class ApiVentasController {

    constructor(
        private readonly apiVentasService: ApiVentasService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: 'Internal server Error' });
    }

    createVenta = async (req: Request, res: Response) => {
        const { email } = req.body.usuario;
        const fecha_actual = new Date().toISOString();
        const [error, createVentaDto] = CreateVentaDto.create({ ...req.body, vendedor: email, fecha_venta: fecha_actual.slice(0,10)});
        if (error) return res.status(400).json(error);

        this.apiVentasService.createVenta(createVentaDto!,req.headers.authorization!)
            .then(venta => res.status(201).json(venta))
            .catch(error => this.handleError(error, res));
    }

    getVentas = async (req: Request, res: Response) => {

        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        this.apiVentasService.getVentas(paginationDto!, req.headers.authorization!)
            .then(ventas => res.status(200).json(ventas))
            .catch(error => this.handleError(error, res));
    }

    getVenta = async (req: Request, res: Response) => {

        const { id } = req.params;
        if(!id) res.status(400).json({msg: "El id ingresado no es valido"});

        this.apiVentasService.getVenta(+id, req.headers.authorization!)
        .then(venta => res.status(200).json(venta))
        .catch(error => this.handleError(error,res))
    }
}