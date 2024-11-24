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
  pedidosXMetodoPago: PedidoXMetodoPago[];
  detalles: DetallePedido[];
  solicitadoEn?: Date;
  verificadoEn?: Date;
  entregadoEn?: Date;
  pagado: boolean;
  pagadoEn?: Date;
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
  id: string;
}

export interface PedidoXMetodoPago extends EntidadBase {
  monto: number;
  pedido: Pedido;
  metodoPago: MetodoPago;
  pago?: Pago;
}

export interface DetallePedido extends EntidadBase {
  cantidad: number;
  subtotal: number;
  producto: Producto;
  pedido: Pedido;
}

export interface Pago extends EntidadBase {
  esTransferencia: boolean;
  montoCobrado: number;
  numeroOperacion: string;
  urlEvidencia: string;
  codigoTransaccion: string;
}
