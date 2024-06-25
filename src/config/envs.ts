import "dotenv/config";
import { get } from "env-var";

export const envs = {
    PORT: get("PORT").required().asPortNumber(),
    JWT_SEED: get("JWT_SEED").required().asString(),

    SEND_EMAIL: get('SEND_EMAIL').default('false').asBool(),
    MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
    MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),
    WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),
    WHITELIST: get('WHITELIST').required().asString(),
    API_VENTAS: get('API_VENTAS').required().asString(),
    API_VENTAS_SECRET: get('API_VENTAS_SECRET').required().asString()
}