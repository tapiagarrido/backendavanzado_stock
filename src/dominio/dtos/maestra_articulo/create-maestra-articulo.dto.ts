

export class CreateMaestraArticuloDto {

    private constructor(
        public readonly nombre: string,
        public readonly codigo_barra: string,
        public readonly marca: string,
        public readonly descripcion: string,
        public readonly valor: number,
        public readonly usuario_id: string,
        public readonly tipo_id: number,
        public readonly linea_id: number,
        public readonly local_id: number,
        public readonly unidad_medida_venta_id: number,
        public readonly categoria_id?: number | null
    ) { }

    static create(object: { [key: string]: any }): [string?, CreateMaestraArticuloDto?] {

        const { nombre, codigo_barra, marca, descripcion, valor, usuario_id, tipo_id, linea_id, local_id, unidad_medida_venta_id, categoria_id } = object;

        if (!nombre) return ["No se encuentra el nombre del articulo"];
        if (!codigo_barra) return ["No se encuentra el codigo de barra del articulo"];
        if (!marca) return ["No se encuentra la marca del articulo"];
        if (!descripcion) return ["No se encuentra la descripción del articulo"];
        if (!valor) return ["No se encuentra el valor del articulo"];
        if (!usuario_id) return ["No se encuentra el usuario_id"];
        if (!tipo_id) return ["No se encuentra el tipo del articulo"];
        if (!linea_id) return ["No se encuentra la linea del articulo"];
        if (!local_id) return ["No se encuentra el local del articulo"];
        if (!unidad_medida_venta_id) return ["No se encuentra la unidad de medida del articulo"];


        return [undefined, new CreateMaestraArticuloDto(nombre, codigo_barra, marca, descripcion, valor, usuario_id, tipo_id, linea_id, local_id, unidad_medida_venta_id, categoria_id)]
    }
}