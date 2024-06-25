
export class RegistrarUsuarioDto {

    private constructor(
        public readonly alias: string,
        public readonly nombre_completo: string,
        public readonly email: string,
        public readonly contrasena: string,
        public readonly telefono: string,
        public readonly rol_id:number | null
    ) { }

    static create(object: { [key: string]: any }): [string?, RegistrarUsuarioDto?] {

        const { alias, nombre_completo, email, contrasena, telefono,rol_id } = object;

        if(!alias) return ["No se encuentra el alias"];
        if(!nombre_completo) return ["No se encuentra el nombre completo"];
        if(!email) return ["No se encuentra el correo"];
        if(!contrasena) return ["No se encuentra la contraseña"];
        if(!telefono) return ["No se encuentra el telefono"];

        return [undefined, new RegistrarUsuarioDto(alias, nombre_completo, email, contrasena, telefono, rol_id !== undefined ? rol_id : null)]
    }
}