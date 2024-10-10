import { EntidadBase } from "./EntidadBase";
import { InventarioMotorizado } from "./PaqueteEnvio";

// /frontend/models/Producto.ts

// Define the Producto interface for frontend use
export interface Producto extends EntidadBase {
    id: string;
    tipoProducto?: TipoProducto;
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
    cantMinPed: number;
    cantMaxPed: number;
    descripcion?: string; // Optional field
    informacionNutricional?: string; // Optional field
    razonEliminacion?: string; // Optional field
    seVendeEcommerce: boolean;
}


export interface TipoProducto extends EntidadBase { //Placeholder, borrar o reemplazar si lo consideran necesario
    id: string;
    nombre: string;
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


