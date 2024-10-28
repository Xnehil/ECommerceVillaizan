import { EntidadBase } from "./EntidadBase";
import { Ciudad, Motorizado, Usuario } from "./PaqueteMotorizado";
import { Producto } from "./PaqueteProducto";

export interface Pedido extends EntidadBase {
  estado: string;
  prioridadEntrega: string;
  total: number;
  puntosOtorgados: number;
  motivoCancelacion: string;
  codigoSeguimiento: string;
  montoEfectivoPagar: number;
  motorizado: Motorizado;
  direccion: Direccion;
  usuario: Usuario;
  metodosPago: MetodoPago[];
  detalles: DetallePedido[];
}

export interface Direccion extends EntidadBase {
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  distrito: string;
  codigoPostal: string;
  referencia: string;
  ciudad: Ciudad;
}

export interface MetodoPago extends EntidadBase {
  nombre: string;
  pedidos: Pedido[];
}

export interface DetallePedido extends EntidadBase {
  cantidad: number;
  subtotal: number;
  producto: Producto;
  pedido: Pedido;
}
