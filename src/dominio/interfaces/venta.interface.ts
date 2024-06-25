export interface Venta {
    id:          number;
    fecha_venta: Date;
    vendedor:    string;
    detalles:    Detalle[];
}

export interface Detalle {
    id:              number;
    venta:           number;
    codigo_barra:    string;
    cantidad:        number;
    precio_unitario: string;
}
