
export class UpdateLocalDto {

    private constructor(
        public readonly id: number,
        public readonly nombre: string,
        public readonly descripcion: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, UpdateLocalDto?] {

        const { id, nombre, descripcion } = object;

        if (!id || typeof (id) !== "number" || isNaN(Number(id))) return ["El id ingresado no es valido"];
        if (!nombre) return ["No se encuentra el nombre del local"];
        if (!descripcion) return ["No se encuentra la descripcion del local"];

        return [undefined, new UpdateLocalDto(id, nombre, descripcion)]

    }
}