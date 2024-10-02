import { 
    BeforeInsert, 
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn, 
    PrimaryColumn, 
    DeleteDateColumn,
    JoinColumn,
    ManyToOne
} from "typeorm";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { EntidadBase } from "./EntidadBase";
import { Producto } from "./Producto";
import { Pedido } from "./Pedido";

@Entity("vi_detallepedido")
export class DetallePedido extends EntidadBase{

    @Column({ type: "int", nullable: false })
    cantidad: number;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    subtotal: number;

    // Foreign key relationships can be added later when the related entities are defined
    //@Column({ type: "varchar", length: 50, nullable: true, name: "id_producto" })
    //id_producto: string;

    @ManyToOne(() => Producto, producto => producto.id)
    @JoinColumn({ name: "id_producto" })
    producto: Producto;

    // Foreign key relationships can be added later when the related entities are defined
    //@Column({ type: "varchar", length: 50, nullable: true, name: "id_pedido" })
    //id_pedido: string;

    @ManyToOne(() => Pedido, pedido => pedido.id)
    @JoinColumn({ name: "id_pedido" })
    pedido: Pedido;

    // Foreign key relationships can be added later when the related entities are defined
    // @Column({ type: "varchar", length: 50, nullable: true, name: "id_promocion" })
    // idPromocion: string;

    // @ManyToOne(() => Promocion, promocion => promocion.id)
    // @JoinColumn({ name: "id_promocion" })
    // promocion: Promocion;
    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "detPed");
    }
}
