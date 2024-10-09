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

export interface Pedido {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
  desactivadoEn: string | null;
  usuarioCreacion: string;
  usuarioActualizacion: string | null;
  estaActivo: boolean;
  estado: string;
  prioridadEntrega: string;
  total: string;
  puntosOtorgados: number;
  motivoCancelacion: string;
  codigoSeguimiento: string;
  montoEfectivoPagar: string;
}
