import { EntidadBase } from "./EntidadBase";
import { Motorizado } from "./PaqueteMotorizado";

// /frontend/models/Producto.ts

// Define the Producto interface for frontend use
export interface Producto extends EntidadBase {
    id: string;
    tipoProducto: TipoProducto;
    subcategorias: Subcategoria[];
    frutas: Fruta[];
    inventarios: InventarioMotorizado[];
    codigo: string;
    nombre: string;
    precioA: number;
    precioB: number;
    precioC: number;
    precioEcommerce: number;
    urlImagen: string;
    descripcion?: string; // Optional field
    informacionNutricional?: string; // Optional field
    razonEliminacion?: string; // Optional field
    seVendeEcommerce: boolean;
    cantidadPuntos?: number; // Optional field
    stockSeguridad?: number; 
}


export interface TipoProducto extends EntidadBase { //Placeholder, borrar o reemplazar si lo consideran necesario
    id: string;
    nombre: string;
    subcategorias?: Subcategoria[];
    productos?: Producto[];
}

export interface Subcategoria extends EntidadBase { //Placeholder, borrar o reemplazar si lo consideran necesario
    id: string;
    nombre: string;
    productos: Producto[];
}

export interface Fruta extends EntidadBase { //Placeholder, borrar o reemplazar si lo consideran necesario
    id: string;
    nombre: string;
    productos: Producto[];
}

export interface InventarioMotorizado extends EntidadBase {
    id: string;
    stock: number;
    stockMinimo: number;
    esMerma: boolean;
    motivoMerma?: string;
    urlImagenMerma?: string;
    motorizado: Motorizado;
    producto: Producto;
}

