import { 
    BeforeInsert, 
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn 
} from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { EntidadBase } from "./EntidadBase"

@Entity("vi_banco")
export class Banco extends EntidadBase {
    @Column({ type: "varchar", length: 100, nullable: false })
    nombre: string;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "bnk")
    }
}
