

export class CreateUnidadMedidaVentaDto {

    private constructor(
        public readonly nombre: string,
    ) { }

    static create(object: { [key: string]: any }): [string?,CreateUnidadMedidaVentaDto?] {

        const { nombre, descripcion } = object;

        if (!nombre) return ["No se encuentra el nombre del local"];

        return [undefined, new CreateUnidadMedidaVentaDto(nombre)];
    }
}