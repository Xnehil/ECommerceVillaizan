import { 
    BeforeInsert, 
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn, 
    PrimaryGeneratedColumn, 
    ManyToOne,
    JoinColumn,
    PrimaryColumn
} from "typeorm";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { EntidadBase } from "./EntidadBase";
import { Producto } from "./Producto";

//Cambiar sprint
@Entity("vi_puntos_producto")
export class PuntosProducto /*extends EntidadBase*/ {

    @PrimaryColumn({ type: "integer", name: "id_puntosproducto" })
    idPuntosProducto: number;

    @Column({ type: "integer", nullable: false, name: "cantidadpuntos" })
    cantidadPuntos: number;

    @Column({ type: "boolean", nullable: false, name: "estado" })
    estado: boolean;

    @Column({ type: "timestamp", nullable: false, name: "fechaactivo" })
    fechaActivo: Date;

    @Column({ type: "timestamp", nullable: false, name: "fechainactivo" })
    fechaInactivo: Date;

    @ManyToOne(() => Producto, producto => producto.id, { eager: true })
    @JoinColumn({ name: "id_producto" })
    producto: Producto;

}