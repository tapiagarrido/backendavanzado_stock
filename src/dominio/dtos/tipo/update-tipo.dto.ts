


export class UpdateTipoDto {

    private constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly descripcion: string,
        public readonly usuario_id: string
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateTipoDto?] {

        const { id, nombre, descripcion, usuario_id } = object;

        if (!id || typeof (id) !== "number" || isNaN(Number(id))) return ["El id ingresado no es valido"];
        if (!nombre) return ["No se encuentra el nombre del tipo"];
        if (!descripcion) return ["No se encuentra la descripcion del tipo"];
        if (!usuario_id) return ["No se encuentra el usuario_id"];

        return [undefined, new UpdateTipoDto(id, nombre, descripcion, usuario_id)]

    }
}