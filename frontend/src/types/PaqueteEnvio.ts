import { EntidadBase } from "./EntidadBase";
import { Pedido } from "./PaquetePedido";
import { Producto } from "./PaqueteProducto";
import { Usuario } from "./PaqueteUsuario";


// Define any additional interfaces needed for your application

export interface Motorizado extends EntidadBase { // Placeholder, replace if necessary
    pedidos: Pedido[]; // One-to-many relationship
    placa: string;
    urlImagen : string;
    usuario?: Usuario;
    almacen?: Almacen;
    inventarios: InventarioMotorizado[]; // One-to-many relationship
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
    guardada?: boolean;
    usuario?: Usuario;
    envios: Pedido[]; // One-to-many relationship
    nombre?: string;
}

export interface Ciudad extends EntidadBase { // Placeholder, replace if necessary
    nombre: string;
    direcciones?: Direccion[]; // One-to-many relationship
}

export interface Ubicacion extends EntidadBase { // Placeholder, replace if necessary
    latitud: number;
    longitud: number;
    direcciones?: Direccion[]; // One-to-many relationship
}

export interface InventarioMotorizado extends EntidadBase {
    stock: number;
    stockMinimo: number;
    esMerma: boolean;
    motivoMerma?: string; // Optional field
    urlImagenMerma?: string; // Optional field
    motorizado: Motorizado;
    producto: Producto;
}

export interface Almacen extends EntidadBase {
    nombre: string;
    motorizados: Motorizado[]; // One-to-many relationship
}