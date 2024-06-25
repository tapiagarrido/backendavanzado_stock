

export class ValidarUsuarioDto {

    private constructor(
        public readonly id: string,
        public readonly activo: boolean,
        public readonly email: string
    ) { }

    static create(object: { [key: string]: any }): [string?, ValidarUsuarioDto?] {

        const { id, email, contrasena } = object;

        if (!id) return ["No se encuentra el id del usuario"];
        if (!email) return ["No se encuentra el correo"];
        if (!contrasena) return ["No se encuentra la contraseña"];

        return [undefined, new ValidarUsuarioDto(id, email, contrasena)]
    }
}