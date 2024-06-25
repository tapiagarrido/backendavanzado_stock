

export class CreateLineaDto {

    private constructor(
        public readonly nombre: string,
        public readonly descripcion: string,
        public readonly usuario_id: string
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateLineaDto?] {

        const { nombre, descripcion, usuario_id } = object;

        if (!nombre) return ["No se encuentra el nombre de la linea"];
        if (!descripcion) return ["Debe ingresar una descripción de la linea"];
        if (!usuario_id) return ["No se encuentra el usuario_id"];

        return [undefined, new CreateLineaDto(nombre, descripcion, usuario_id)];
    }
}