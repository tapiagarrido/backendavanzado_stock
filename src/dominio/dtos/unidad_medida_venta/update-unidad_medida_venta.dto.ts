
export class UpdateUnidadMedidaVentaDto {

    private constructor(
        public readonly id: number,
        public readonly nombre: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateUnidadMedidaVentaDto?] {

        const { id, nombre } = object;

        if (!id || typeof (id) !== "number" || isNaN(Number(id))) return ["El id ingresado no es valido"];
        if (!nombre) return ["No se encuentra el nombre del local"];

        return [undefined, new UpdateUnidadMedidaVentaDto(id, nombre)]

    }
}