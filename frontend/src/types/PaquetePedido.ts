import { EntidadBase } from "./EntidadBase";
import { Producto } from "./PaqueteProducto";


// Define the Pedido interface for frontend use
export interface Pedido extends EntidadBase {
    estado: string;
    prioridadEntrega?: string; // Optional field
    total: number;
    puntosOtorgados: number;
    motivoCancelacion?: string; // Optional field
    codigoSeguimiento?: string; // Optional field
    montoEfectivoPagar?: number; // Optional field
    motorizado?: Motorizado; // Optional field
    direccion?: Direccion; // Optional field
    metodosPago: MetodoPago[]; // Many-to-many relationship
    detalles: DetallePedido[]; // One-to-many relationship
}

// Define any additional interfaces needed for your application

export interface Motorizado extends EntidadBase { // Placeholder, replace if necessary
    pedidos: Pedido[]; // One-to-many relationship
}

export interface Direccion extends EntidadBase { // Placeholder, replace if necessary
    pedidos: Pedido[]; // One-to-many relationship
}

export interface MetodoPago extends EntidadBase { // Placeholder, replace if necessary
    pedidos: Pedido[]; // Many-to-many relationship
}

export interface DetallePedido extends EntidadBase { // Placeholder, replace if necessary
    pedido: Pedido; // Many-to-one relationship
    cantidad: number;
    subtotal: number;
    producto: Producto; // Many-to-one relationship
}
