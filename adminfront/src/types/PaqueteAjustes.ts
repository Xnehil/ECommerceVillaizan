import { EntidadBase } from "./EntidadBase";

export interface Ajuste extends EntidadBase {
    llave: string;
    valor: string;
    tag: string;
    descripcion: string;
}
