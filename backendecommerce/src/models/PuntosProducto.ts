import { 
    BeforeInsert, 
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn, 
    PrimaryGeneratedColumn, 
    ManyToOne,
    JoinColumn,
    PrimaryColumn,
    DeleteDateColumn,
    BeforeUpdate
} from "typeorm";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { EntidadBase } from "./EntidadBase";
import { Producto } from "./Producto";


@Entity("vi_puntos_producto")
export class PuntosProducto /*extends EntidadBase*/ {

    @PrimaryColumn({ type: "integer", name: "id_puntosproducto" })
    id_puntosproducto: number;

    @Column({ type: "integer", nullable: false, name: "cantidadpuntos" })
    cantidadPuntos: number;

    @CreateDateColumn({ type: "timestamp", name: "creadoen"})
    creadoEn: Date;

    @UpdateDateColumn({ type: "timestamp" , name: "actualizadoen"})
    actualizadoEn: Date;

    @DeleteDateColumn({ type: "timestamp", name: "desactivadoen", nullable: true })
    desactivadoEn: Date | null;

    @Column({ type: "varchar", name: "usuariocreacion", length: 50 })
    usuarioCreacion: string;

    @Column({ type: "varchar", name: "usuarioactualizacion", length: 50, nullable: true })
    usuarioActualizacion: string;

    @Column({ type: "boolean", name: "estaactivo", default: true })
    estaActivo: boolean;

    @BeforeInsert()
    llenarUsuarioCreacion() {
        this.usuarioCreacion = "admin";
    }

    @BeforeUpdate()
    llenarUsuarioActualizacion() {
        this.usuarioActualizacion = "admin";
    }

    @ManyToOne(() => Producto, producto => producto.id, { eager: true })
    @JoinColumn({ name: "id_producto" })
    producto: Producto;

}