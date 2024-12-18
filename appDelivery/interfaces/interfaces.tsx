export interface Usuario {
  id: string;
  
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
  
  estaActivo: boolean;
  cantidad: number;
  subtotal: string;
  producto: Producto;
}

export interface Producto {
  id: string;
  
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
  stockSeguridad: number;
}

export interface Pedido {
  id: string;
  creadoEn:Date|null;
  estaActivo: boolean;
  estado: string;
  prioridadEntrega: string | null;
  total: number;
  puntosOtorgados: number;
  motivoCancelacion: string | null;
  codigoSeguimiento: string;
  montoEfectivoPagar: number | null;
  solicitadoEn?: Date;
  verificadoEn?: Date;
  entregadoEn?: Date;
  urlEvidencia: string | null;
  motorizado: Motorizado | null; 
  direccion: Direccion | null;   
  usuario: Usuario | null;  
  detalles: DetallePedido[] | null;
  pedidosXMetodoPago: PedidoXMetodoPago[] | null;
  pagos: Pago[] | null;
  pagado: boolean;
  pagadoEn?: Date;
}

export interface Direccion {
  id: string;
  
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
  
  estaActivo: boolean;
  latitud: string;
  longitud: string;
}

export interface Motorizado {
  id: string;
  
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
  
  estaActivo: boolean;
  nombre: string;
}

export interface MetodoDePagoResponse {
  metodoPagos: MetodoDePago[];
}

export interface Venta {
  tipoComprobante: string;
  id: string;
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
  
  estaActivo: boolean;
  nombre: string;
}

export interface PagoResponse {
  pago: Pago;
}

export interface TipoProducto {
  id: string;
  
  estaActivo: boolean;
  nombre: string;
  subcategorias: Subcategoria[];
}

export interface Subcategoria {
  id: string;
  
  estaActivo: boolean;
  nombre: string;
  tipoProducto: TipoProducto[];
}

export interface Notificacion {
  id: string;
  
  estaActivo: boolean;
  asunto: string;
  descripcion: string | null;
  tipoNotificacion: string;
  leido: boolean;
  sistema: string;
  usuario: Usuario;
}

export interface PedidoXMetodoPago {
  id: string;
  
  estaActivo: boolean;
  monto: number;
  pedido: Pedido;
  metodoPago: MetodoDePago;
  Pago: Pago | null;
}

export interface Coordinate  {
  lat: number;
  lng: number;
};

export interface PedidoLoc{
  id: string;
  nombre: string;
  activo: boolean;
  lat: number;
  lng: number;
};