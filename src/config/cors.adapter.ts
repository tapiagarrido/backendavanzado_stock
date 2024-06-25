import cors from 'cors';
import { envs } from '../config';

export class CorsAdapter {
    static configureCors() {
        return cors({
            origin: envs.WHITELIST,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        });
    }
}
