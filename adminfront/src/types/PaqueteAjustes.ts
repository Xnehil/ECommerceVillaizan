import { EntidadBase } from "./EntidadBase";
import { Producto } from "./PaqueteProducto";

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

export interface Plantilla extends EntidadBase {
  nombre: string;
  descripcion: string;
  productos: PlantillaProducto[];
}

export interface PlantillaProducto extends EntidadBase {
  plantilla: Plantilla;
  producto: Producto;
  cantidad: number;
}
