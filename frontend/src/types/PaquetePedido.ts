import { EntidadBase } from "./EntidadBase";
import { Direccion, Motorizado } from "./PaqueteEnvio";
import { Producto } from "./PaqueteProducto";
import { Usuario } from "./PaqueteUsuario";


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
    usuario?: Usuario;
    metodosPago: MetodoPago[]; // Many-to-many relationship
    detalles: DetallePedido[]; // One-to-many relationship
}

// Define any additional interfaces needed for your application
export interface MetodoPago extends EntidadBase { // Placeholder, replace if necessary
    nombre: string;
    pedidos: Pedido[]; // Many-to-many relationship
}

export interface DetallePedido extends EntidadBase { // Placeholder, replace if necessary
    pedido?: Pedido; // Many-to-one relationship
    cantidad: number;
    subtotal: number;
    producto: Producto; // Many-to-one relationship
}
