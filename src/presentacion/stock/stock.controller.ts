import { Request, Response } from "express";
import { StockService } from "../../services/stock.service";
import { CreateStockDto, UpdateStockDto, CustomError, PaginationDto, CreateStockDetalleDto } from "../../dominio";


export class StockController {

    constructor(
        private readonly stockService: StockService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        return res.status(500).json({ error: 'Internal server Error' });
    }

    createStock = async (req: Request, res: Response) => {
        const { id: usuarioId } = req.body.usuario;
        if (!req.body.stock_detalle) return res.status(404).json("No se han ingresado los productos");
        const { stock_detalle } = req.body;
        req.body.cantidad_total = stock_detalle.reduce((total: number, stock: CreateStockDetalleDto) => total + stock.cantidad_ingresada, 0);
        const [error, createStockDto] = CreateStockDto.create({ ...req.body, usuario_id: usuarioId });
        if (error) return res.status(400).json(error);

        this.stockService.createStock(createStockDto!)
            .then(stock => res.status(201).json(stock))
            .catch(error => this.handleError(error, res));
    }

    getStocks = async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const [error, paginationDto] = PaginationDto.create(+page, +limit);
        if (error) return res.status(400).json({ error });

        this.stockService.getStocks(paginationDto!)
            .then(stocks => res.status(200).json(stocks))
            .catch(error => this.handleError(error, res));

    }

    getStockById = async (req: Request, res: Response) => {
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        this.stockService.getStock(+id)
            .then(stock => res.status(200).json(stock))
            .catch(error => this.handleError(error, res));
    }

    updateStock = async (req: Request, res: Response) => {
        const { id: usuarioId } = req.body.usuario
        const { id } = req.params;
        if (!id) return res.status(400).json("Debe ingresar el id a buscar");

        const [error, updateStockDto] = UpdateStockDto.create({ id: +id, usuario_id: usuarioId, ...req.body });
        if (error) return res.status(400).json(error);

        this.stockService.updateStock(updateStockDto!)
            .then(stock => res.status(201).json(stock))
            .catch(error => this.handleError(error, res));
    }

    deleteStock = async (req: Request, res: Response) => {

        const { id, id_detalle } = req.params;

        this.stockService.deleteStock(+id, +id_detalle)
            .then(stock => res.status(200).json(stock))
            .catch(error => this.handleError(error, res));
    }
}