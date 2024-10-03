export interface  EntidadBase{
    id: string;
    creadoEn: Date;
    actualizadoEn: Date;
    desactivadoEn: Date | null;
    usuarioCreacion: string;
    usuarioActualizacion: string;
    estaActivo: boolean;
}