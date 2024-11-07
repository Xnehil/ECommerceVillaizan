
import { EntidadBase } from "./EntidadBase";


export interface Promocion extends EntidadBase {
    descripcion?: string; // Optional field
    titulo: string;
    fechaInicio: Date;
    fechaFin: Date;
    limiteStock: number;
    porcentajeDescuento: number;
}