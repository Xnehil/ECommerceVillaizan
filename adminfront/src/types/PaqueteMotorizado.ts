import { EntidadBase } from "./EntidadBase";
import { InventarioMotorizado } from "./PaqueteProducto";

export interface Motorizado extends EntidadBase {
  id: string;
  placa: string;
  urlImagen: string;
  almacen: Almacen;
  ciudad: Ciudad;
  disponible: boolean;
  usuario: Usuario;
  inventarios?: InventarioMotorizado[];
  pedidos?: Pedido[];
}

export interface Almacen extends EntidadBase {
  id: string;
}

export interface Ciudad extends EntidadBase {
  id: string;
  nombre: string;
  region: string;
  direcciones?: Direccion[];
}

export interface Direccion extends EntidadBase {
  id: string;
}

export interface Usuario extends EntidadBase {
  id: string;
  nombre: string;
  apellido: string;
  conCuenta: boolean;
  numeroTelefono: string | null;
  correo: string;
  contrasena: string;
  fechaUltimoLogin: Date | null;
}

export interface Pedido extends EntidadBase {
  id: string;
}
