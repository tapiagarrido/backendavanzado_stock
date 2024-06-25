import { envs } from "./config";
import { AppRoutes } from "./presentacion/routes";
import { Server } from "./presentacion/server";

(async () => {
    main();
})();


async function main() {

    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes
    })

    server.initApp();
    
}