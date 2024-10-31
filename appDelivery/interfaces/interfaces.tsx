export interface Usuario {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  nombre: string;
  apellido: string;
  conCuenta: boolean;
  numeroTelefono: string;
  correo: string;
  contrasena: string;
  fechaUltimoLogin: string | null;
}

export interface UsuariosResponse {
  usuarios: Usuario[];
}

export interface UsuarioResponse {
  usuario: Usuario;
}

export interface PedidosResponse {
  pedidos: Pedido[];
}

export interface Almacen {
}

export interface Ciudad {
}


export interface DetallePedido {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  cantidad: number;
  subtotal: string;
  producto: Producto;
}

export interface Producto {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  codigo: string;
  nombre: string;
  precioA: string;
  precioB: string;
  precioC: string;
  precioEcommerce: string;
  urlImagen: string;
  descripcion: string;
  informacionNutricional: string;
  razonEliminacion: string | null;
  seVendeEcommerce: boolean;
  tipoProducto: TipoProducto;
}

export interface Pedido {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  estado: string;
  prioridadEntrega: string | null;
  total: string;
  puntosOtorgados: number;
  motivoCancelacion: string | null;
  codigoSeguimiento: string;
  montoEfectivoPagar: string;
  motorizado: Motorizado | null; 
  direccion: Direccion | null;   
  usuario: Usuario | null;  
  urlEvidencia: string | null;
  detalles: DetallePedido[] | null ;
  metodosPago: MetodoDePago[] | null;
  solicitadoEn?: Date;
  verificadoEn?: Date;
  entregadoEn?: Date;
}

export interface Direccion {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  calle: string;
  numeroExterior: string;
  numeroInterior: string | null;
  distrito: string;
  codigoPostal: string | null;
  referencia: string | null;
  ciudad: Ciudad | null;
  ubicacion: Ubicacion | null; 
}

export interface Ubicacion {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  latitud: string;
  longitud: string;
}

export interface Motorizado {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  placa: string;
  urlImagen: string | null;
  disponible: boolean;
  almacen: Almacen | null;
  ciudad: Ciudad | null;
  usuario: Usuario | null;
}

export interface MotorizadoResponse {
  motorizado: Motorizado;
}
export interface InventarioMotorizado {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  stock: number;
  stockMinimo: number;
  esMerma: boolean;
  motivoMerma: string | null;
  urlImagenMerma: string | null;
  motorizado: Motorizado;
  producto: Producto;
}

export interface InventarioMotorizadoResponse {
  inventarioMotorizadoes: InventarioMotorizado[];
}

export interface MetodoDePago {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  nombre: string;
}

export interface MetodoDePagoResponse {
  metodoPagos: MetodoDePago[];
}

export interface Venta {
  tipoComprobante: string;
  fechaVenta: Date;
  numeroComprobante: string;
  montoTotal: number;
  totalPaletas: number;
  totalMafeletas: number;
  estado: string;
  totalIgv: number;
  pedido: Pedido;
  ordenSerie: null;
}

export interface Pago {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  esTransferencia: boolean;
  montoCobrado: number;
  numeroOperacion: string | null;
  urlEvidencia: string | null;
  codigoTransaccion: string | null;
  venta: Venta;
  metodoPago: MetodoDePago;
  banco: Banco | null;
  pedido: Pedido;
}

export interface Banco {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  nombre: string;
}

export interface PagoResponse {
  pago: Pago;
}

export interface TipoProducto {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  nombre: string;
  subcategorias: Subcategoria[];
}

export interface Subcategoria {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  nombre: string;
  tipoProducto: TipoProducto[];
}

export interface Notificacion {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  asunto: string;
  descripcion: string | null;
  tipoNotificacion: string;
  leido: boolean;
  sistema: string;
  usuario: Usuario;
}