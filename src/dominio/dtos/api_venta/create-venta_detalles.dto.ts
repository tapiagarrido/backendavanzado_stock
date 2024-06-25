export class CreateVentaDetallesDto {

    constructor(
        public readonly codigo_barra: string,
        public readonly cantidad: number,
        public readonly precio_unitario: number,
        public readonly descuento?: number
    ) { }



    static create(object: { [key: string]: any }): [string?, CreateVentaDetallesDto?] {

        const { codigo_barra, cantidad, precio_unitario, descuento } = object;

        if (!codigo_barra) return ["No se encuentra codigo de barra"];
        if (!cantidad) return ["No se encuentra la cantidad"];
        if (!precio_unitario) return ["No se encuentra el precio"]

        return [undefined, new CreateVentaDetallesDto(codigo_barra, cantidad, precio_unitario, descuento)]
    }
}