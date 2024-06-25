import { Logger, createLogger, transports, format } from "winston";


const { combine, timestamp, printf, colorize } = format;


export class WinstonAdapter {

    private logger: Logger;
    constructor() {
        this.logger = createLogger({
            level: 'info',
            format: combine(
                colorize({ all: true }),
                timestamp({ format: 'YYYY/MM/DD HH:mm:ss' }),
                printf(info => `${info.timestamp} - [${info.level}]: ${info.message}`)
            ),
            transports: [
                new transports.Console()
            ]
        });
    }

    mostrarInfo(message: string): void {
        this.logger.info(message);
    };

    mostrarError(message: string, error?: Error): void {
        if (error) {
            this.logger.error(`${message}: ${error.message}`);
        } else {
            this.logger.error(message);
        }
    }

}