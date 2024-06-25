import { CreateStockDetalleDto } from "../stock_detalle/create-stock_detalle.dto";



export class CreateStockDto {

    constructor(
        public readonly codigo_barra: string,
        public readonly cantidad_total: number,
        public readonly stock_detalle: CreateStockDetalleDto[],
        public readonly usuario_id: string,
        public readonly cantidad_ideal?: number,
        public readonly cantidad_minima?: number
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateStockDto?] {

        const { codigo_barra, cantidad_total, stock_detalle,usuario_id, cantidad_ideal, cantidad_minima } = object;

        if (!codigo_barra) return ["No se encuentra el producto"];
        if (!cantidad_total) return ["No se encuentra la cantidad"];
        if(stock_detalle.length === 0) return ["No se encuentra el detalle del stock"]

        return [undefined, new CreateStockDto(codigo_barra, cantidad_total, stock_detalle, usuario_id, cantidad_ideal, cantidad_minima)]
    }
}