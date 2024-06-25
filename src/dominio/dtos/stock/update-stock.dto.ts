import { UpdateStockDeatlleDto } from "../stock_detalle/update-stock_detalle.dto";

export class UpdateStockDto {

    constructor(
        public readonly id: number,
        public readonly maestra_articulo_id: number,
        public readonly codigo_barra: string,
        //public readonly cantidad_total: number,
        public readonly cantidad_ideal: number,
        public readonly cantidad_minima: number,
        public readonly stock_detalle?: UpdateStockDeatlleDto[],
        public readonly usuario_id?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateStockDto?] {

        const { id, maestra_articulo_id,codigo_barra, cantidad_ideal, cantidad_minima, stock_detalle, usuario_id } = object;
        
        if (!id) return ["No se encuentra el id"];
        if (!codigo_barra) return ["No se encuentra la maestra articulo id"];

        return [undefined, new UpdateStockDto(id, maestra_articulo_id,codigo_barra, cantidad_ideal, cantidad_minima, stock_detalle, usuario_id)]
    }
}