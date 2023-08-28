import { DetalleVenta } from "./DetalleVenta"

export interface Venta {
    idVenta?:number,
    numeroDocumento?:string,
    tipoPago:string,
    fechaRegistro?:string,
    totalTexto:string,
    detalleVenta: DetalleVenta[]
}
