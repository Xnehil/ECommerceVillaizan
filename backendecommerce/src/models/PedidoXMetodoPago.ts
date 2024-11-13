import { 
    BeforeInsert, 
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToMany,
    ManyToOne,
    JoinColumn
} from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { EntidadBase } from "./EntidadBase"
import { Pedido } from "./Pedido";
import { MetodoPago } from "./MetodoPago";

@Entity("vi_pedido_metodopago")
export class PedidoXMetodoPago extends EntidadBase {

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false, name: "monto" })
    monto: number;

    @ManyToOne(() => Pedido, pedido => pedido.id, /*{ eager: true }*/)
    @JoinColumn({ name: "id_pedido" })
    pedido: Pedido;

    @ManyToOne(() => MetodoPago, metodoPago => metodoPago.id, /*{ eager: true }*/)
    @JoinColumn({ name: "id_metodopago" })
    metodoPago: MetodoPago;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "pmp")
    }   

}
