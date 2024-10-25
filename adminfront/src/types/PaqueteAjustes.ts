import { EntidadBase } from "./EntidadBase";

export interface Ajuste extends EntidadBase {
    llave: string;
    valor: string;
    tag: string;
    descripcion: string;
}

export interface Notificacion extends EntidadBase {
    asunto: string;
    descripcion: string;
    tipoNotificacion: string;
    leido: boolean;
    sistema: string;
    idUsuario: string;
}