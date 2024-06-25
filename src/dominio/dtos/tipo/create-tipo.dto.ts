

export class CreateTipoDto {

    private constructor(
        public readonly nombre: string,
        public readonly descripcion: string,
        public readonly usuario_id: string
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateTipoDto?] {

        const { nombre, descripcion, usuario_id } = object;

        if (!nombre) return ["No se encuentra el nombre del tipo"];
        if (!descripcion) return ["Debe ingresar una descripción del tipo"];
        if (!usuario_id) return ["No se encuentra el usuario_id"];

        return [undefined, new CreateTipoDto(nombre, descripcion, usuario_id)];
    }
}