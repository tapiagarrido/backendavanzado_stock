import { CustomError } from "../errors/custom.error";


export class MaestraArticuloEntity {
    
    constructor(
        public id: string,
        public nombre:string,
        public codigo_barra:string,
        public marca: string,
        public descripcion:string,
        public valor:number,
        public usuario_id:string,
        public tipo_id:number,
        public linea_id:number,
        public local_id:number,
        public unidad_medida_venta_id:number,
        public categoria_id?:number | null,
    ){}

    static fromObject(object: {[key:string]: any}){
        const {id, nombre, codigo_barra, marca, descripcion,valor,usuario_id,tipo_id,linea_id,local_id,unidad_medida_venta_id,categoria_id} = object;

        if(!id) throw CustomError.badRequestError("No se encuentra un id valido");
        if(!nombre) throw CustomError.badRequestError("No se encuentra el nombre");
        if(!codigo_barra) throw CustomError.badRequestError("No se encuentra el codigo de barra");
        if(!marca) throw CustomError.badRequestError("No se encuentra la marca");
        if(!descripcion) throw CustomError.badRequestError("No se encuentra la descripción");
        if(!valor) throw CustomError.badRequestError("No se encuentra el valor");
        if(!usuario_id) throw CustomError.badRequestError("No se encuentra el usuario_id");
        if(!tipo_id) throw CustomError.badRequestError("No se encuentra el tipo");
        if(!linea_id) throw CustomError.badRequestError("No se encuentra la linea");
        if(!local_id) throw CustomError.badRequestError("No se encuentra el local");
        if(!unidad_medida_venta_id) throw CustomError.badRequestError("No se encuentra la unidad de medida");

        return new MaestraArticuloEntity(id, nombre, codigo_barra, marca, descripcion,valor,usuario_id,tipo_id,linea_id,local_id,unidad_medida_venta_id,categoria_id);
    }
}