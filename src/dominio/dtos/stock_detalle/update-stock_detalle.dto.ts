
export class UpdateStockDeatlleDto {

    constructor(
        public readonly id: number,
        public readonly stock_id: number,
        public readonly usuario_id: string,
        public readonly cantidad_ingresada: number,
        public readonly fecha_ingreso: Date = new Date(),
        public readonly cantidad_vendida?: number,
        public readonly cantidad_merma?: number,
        public readonly fecha_vencimiento?: Date,
        public readonly proveedor?: string,
        public readonly lote?: string,
        public readonly precio_compra?: number,
        public readonly observacion?: string
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateStockDeatlleDto?] {

        const { id, stock_id, usuario_id, cantidad_ingresada, fecha_ingreso, cantidad_vendida, cantidad_merma, fecha_vencimiento, proveedor, lote, precio_compra, observacion } = object;

        if (!id) return ["No se encuentra el id"];
        if (!stock_id) return ["No se encuentra el stock encabezado"];
        if (!usuario_id) return ["No se encuentra el usuario"];
        if (!cantidad_ingresada) return ["No se encuentra la cantidad"];

        return [undefined, new UpdateStockDeatlleDto(id, stock_id, usuario_id, cantidad_ingresada, fecha_ingreso, cantidad_vendida, cantidad_merma, fecha_vencimiento, proveedor, lote, precio_compra, observacion)]
    }
}