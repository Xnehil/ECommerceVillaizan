import { 
    BeforeInsert, 
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToMany
} from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { EntidadBase } from "./EntidadBase"
import { Pedido } from "./Pedido";

@Entity("vi_metodopago")
export class MetodoPago extends EntidadBase {

    @Column({ type: "varchar", length: 50, nullable: false })
    nombre: string;

    @ManyToMany(() => Pedido, pedido => pedido.metodosPago)
    pedidos: Pedido[];

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "mp")
    }   

}
