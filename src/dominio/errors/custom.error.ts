

export class CustomError extends Error {

    private constructor(
        public readonly statusCode: number,
        public readonly message: string
    ) {
        super(message);
    }

    static badRequestError(message: string) {
        return new CustomError(400, message);
    }

    static unauthorizedError(message: string) {
        return new CustomError(401, message);
    }

    static forbiddenError(message: string) {
        return new CustomError(403, message);
    }

    static notFoundError(message: string) {
        return new CustomError(404, message);
    }

    static methodNotAllowedError(message: string) {
        return new CustomError(405, message);
    }

    static conflictError(message: string) {
        return new CustomError(409, message);
    }

    static internalServerError(message: string) {
        return new CustomError(500, message);
    }

}