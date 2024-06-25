import { CreateVentaDetallesDto } from "./create-venta_detalles.dto";


export class CreateVentaDto {

    constructor(
        public readonly fecha_venta: Date,
        public readonly vendedor: string,
        public readonly detalles: CreateVentaDetallesDto[]
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateVentaDto?] {

        console.log(object)
        const { fecha_venta, vendedor, detalles } = object;

        if (!fecha_venta) return ["No se encuentra la fecha de venta"];
        if (!vendedor) return ["No se encuentra el vendedor"];
        if (detalles.length === 0) return ["No se encuentra el detalle de venta"];

        return [undefined, new CreateVentaDto(fecha_venta, vendedor, detalles)]
    }
}