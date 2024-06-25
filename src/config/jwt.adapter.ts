import jwt from "jsonwebtoken"
import { envs } from "./envs"

export class JwtAdapter {

    static async generarToken(payload: any, duracion: string = "1d") {

        return new Promise((resolve) => {
            jwt.sign(payload, envs.JWT_SEED, { expiresIn: duracion }, (error, token) => {
                if (error) return resolve(null);

                resolve(token);
            });
        })
    }

    // Se usa el generico T, ya que definiremos el tipo especifico desde la instancia
    static validacionToken<T>(token: string): Promise<T | null> {

        return new Promise((resolve) => {
            jwt.verify(token, envs.JWT_SEED, (error, decoded) => {
                if (error) return resolve(null);
                resolve(decoded as T);
            })
        })
    }
}