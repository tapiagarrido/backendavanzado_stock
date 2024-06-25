

export class PaginationDto {

    private constructor(
        public readonly page: number,
        public readonly limit: number
    ) { }

    static create(page: number = 1, limit: number = 10): [string?, PaginationDto?] {

        if (isNaN(page) || isNaN(limit)) return ['El numero de pagina y limite deben ser un numero'];
        if (page <= 0) return ['La pagina debe ser mayor a 0'];
        if (limit <= 0) return ['El limite debe ser mayor a 0'];

        return [undefined, new PaginationDto(page, limit)];

    }
}