

export interface ErrorAxios {

    response: Response
}

interface Response {
    data: Data
}

interface Data {
    error: string
}