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
  detalles: DetallePedido[] | null ;
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