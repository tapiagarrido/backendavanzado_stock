

export class CreateLocalDto {

    private constructor(
        public readonly nombre: string,
        public readonly descripcion: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateLocalDto?] {

        const { nombre, descripcion } = object;

        if (!nombre) return ["No se encuentra el nombre del local"];
        if (!descripcion) return ["Debe ingresar una descripción del local"];

        return [undefined, new CreateLocalDto(nombre, descripcion)];
    }
}