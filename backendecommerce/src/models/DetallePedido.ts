import { 
    BeforeInsert, 
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn, 
    PrimaryColumn, 
    DeleteDateColumn
} from "typeorm";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { EntidadBase } from "./EntidadBase";

@Entity("vi_detallepedido")
export class DetallePedido {

    // TO DO - Ver si funciona

    @PrimaryColumn({ type: "varchar", length: 50, name: "id_producto" })
    idProducto: string;

    @PrimaryColumn({ type: "varchar", length: 50, name: "id_pedido" })
    idPedido: string;

    @Column({ type: "int", nullable: false })
    cantidad: number;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    subtotal: number;

    // Foreign key relationships can be added later when the related entities are defined
    // @Column({ type: "varchar", length: 50, nullable: true, name: "id_promocion" })
    // idPromocion: string;

    // @ManyToOne(() => Promocion, promocion => promocion.id)
    // @JoinColumn({ name: "id_promocion" })
    // promocion: Promocion;

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

}
