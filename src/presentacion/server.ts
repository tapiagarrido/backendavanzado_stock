import express, { Router } from 'express';
import cors from 'cors';
import { CorsAdapter, envs } from '../config';

interface Options {
    port: number;
    routes: Router;
}

export class Server {

    public readonly app = express();
    private serverListener?: any;
    private readonly port: number;
    private readonly routes: Router;

    constructor(options: Options) {
        const { port, routes } = options;
        this.port = port;
        this.routes = routes;
    }

    async initApp() {

        /**
         * Manejo de Cors
         */
        this.app.use(CorsAdapter.configureCors());

        /**
         * Middlewares
         */
        this.app.use(express.json()); // raw
        this.app.use(express.urlencoded({ extended: true })); // x-www-form-urlencoded

        /**
         * Public Folder
         */

        /**
         * Routes
         */
        //* Routes
        this.app.use(this.routes);

        
        this.serverListener = this.app.listen(this.port, () => {
            console.log(`Servidor iniciado en el puerto ${this.port}`)
        })

    }

    public close() {
        this.serverListener?.close();
    }
}