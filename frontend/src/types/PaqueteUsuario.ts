import { EntidadBase } from "./EntidadBase";
// Define the Usuario interface for frontend use
export interface Usuario extends EntidadBase {
    nombre: string;
    apellido: string;
    conCuenta: boolean;
    numeroTelefono?: string; // Optional field
    correo: string;
    contrasena: string;
    fechaUltimoLogin?: Date; // Optional field
    persona?: Persona; // Many-to-one relationship
}

// Define the Persona interface for frontend use
export interface Persona extends EntidadBase {
    tipoDocumento: string;
    numeroDocumento: string;
    razonEliminacion?: string; // Optional field
    estado: string;
}