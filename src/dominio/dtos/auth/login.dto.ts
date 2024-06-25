
export class LoginDto {

    private constructor(
        public readonly email: string,
        public readonly contrasena: string,
    ) { }

    static create(object: { [key: string]: any }): [string?, LoginDto?] {

        const { email, contrasena } = object;

        if (!email) return ["No se encuentra el correo"];
        if (!contrasena) return ["No se encuentra la contraseña"];

        return [undefined, new LoginDto(email, contrasena)]
    }
}