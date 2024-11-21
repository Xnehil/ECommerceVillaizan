import { 
    BeforeInsert, 
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToMany,
    ManyToOne,
    JoinColumn,
    OneToOne
} from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { EntidadBase } from "./EntidadBase"
import { Pedido } from "./Pedido";
import { MetodoPago } from "./MetodoPago";
import { Pago } from "./Pago";

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

    @OneToOne(() => Pago, pago => pago.id, /*{ eager: true }*/)
    @JoinColumn({ name: "id_pago" })
    pago: Pago;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "pmp")
    }   

}
