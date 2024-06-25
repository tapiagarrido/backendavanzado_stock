

export class CreateCategoriaDto {

    private constructor(
        public readonly nombre: string,
        public readonly descripcion: string,
        public readonly usuario_id: string
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateCategoriaDto?] {

        const { nombre, descripcion, usuario_id } = object;

        if (!nombre) return ["No se encuentra el nombre de la categoria"];
        if (!descripcion) return ["Debe ingresar una descripción de la categoria"];
        if (!usuario_id) return ["No se encuentra el usuario_id"];

        return [undefined, new CreateCategoriaDto(nombre, descripcion, usuario_id)];
    }
}