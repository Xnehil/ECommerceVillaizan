import { EntidadBase } from "./EntidadBase";
import { Pedido } from "./PaquetePedido";
// Define the Envio interface for frontend use
export interface Envio extends EntidadBase {
    estado: string;
    fechaEnvio: Date;
    fechaEntrega?: Date; // Optional field
    motorizado?: Motorizado; // Optional field
    direccion: Direccion;
    pedido: Pedido;
}

// Define any additional interfaces needed for your application

export interface Motorizado extends EntidadBase { // Placeholder, replace if necessary
    nombre: string;
    telefono: string;
    envios: Envio[]; // One-to-many relationship
}

export interface Direccion extends EntidadBase { // Placeholder, replace if necessary
    calle: string;
    numeroExterior: string;
    numeroInterior?: string; // Optional field
    distrito: string;
    codigoPostal: string;
    referencia?: string; // Optional field
    ciudad?: Ciudad;
    ubicacion?: Ubicacion;
    envios: Envio[]; // One-to-many relationship
}

export interface Ciudad extends EntidadBase { // Placeholder, replace if necessary
    nombre: string;
    direcciones: Direccion[]; // One-to-many relationship
}

export interface Ubicacion extends EntidadBase { // Placeholder, replace if necessary
    latitud: number;
    longitud: number;
    direcciones: Direccion[]; // One-to-many relationship
}