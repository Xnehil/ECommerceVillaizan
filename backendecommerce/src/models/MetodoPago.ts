import { 
    BeforeInsert, 
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToMany,
    ManyToOne,
    OneToMany
} from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { EntidadBase } from "./EntidadBase"
import { Pedido } from "./Pedido";
import { PedidoXMetodoPago } from "./PedidoXMetodoPago";

@Entity("vi_metodopago")
export class MetodoPago extends EntidadBase {

    @Column({ type: "varchar", length: 50, nullable: false })
    nombre: string;

    @OneToMany(() => PedidoXMetodoPago, pedidoXMetodoPago => pedidoXMetodoPago.metodoPago, {eager: true})
    pedidosXMetodoPago: PedidoXMetodoPago[];

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "mp")
    }   

}
