import nodemailer, { Transporter } from "nodemailer";

export interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachement[];
}

export interface Attachement {
    filename: string;
    path: string;
}

export class EmailService {

    private transporter: Transporter;

    constructor(
        mailerService: string,
        mailerEmail: string,
        senderEmailPassword: string,
        private readonly postToProvider: boolean
    ) {
        this.transporter = nodemailer.createTransport({
            service: mailerService,
            auth: {
                user: mailerEmail,
                pass: senderEmailPassword
            }
        });
    }

    async sendEmail(opciones: SendMailOptions): Promise<boolean> {

        const { to, subject, htmlBody, attachments = [] } = opciones;

        try {
            if (!this.postToProvider) return true;

            const enviarInformacion = await this.transporter.sendMail({
                to: to,
                subject: subject,
                html: htmlBody,
                attachments: attachments
            });

            return true;

        } catch (error) {
            return false;
        }

    }
}