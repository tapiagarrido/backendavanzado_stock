
export class UpdateCategoriaDto {

    private constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly descripcion: string,
        public readonly usuario_id: string
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateCategoriaDto?] {
        console.log(object)

        const { id, nombre, descripcion, usuario_id } = object;
        if (!id || typeof id !== "number" || isNaN(id)) return ["No se encuentra el id de la categoria o esta en un formato incorrecto"];
        if (!nombre) return ["No se encuentra el nombre de la categoria"];
        if (!descripcion) return ["Debe ingresar una descripción de la categoria"];
        if (!usuario_id) return ["No se encuentra el usuario"];
        
        return [undefined, new UpdateCategoriaDto(id, nombre, descripcion, usuario_id)];
    }
}