import { 
    BeforeInsert, 
    Column, 
    Entity, 
    PrimaryGeneratedColumn, 
    CreateDateColumn, 
    UpdateDateColumn 
} from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { EntidadBase } from "./EntidadBase"

@Entity("vi_igv")
export class Igv extends EntidadBase {

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: false })
    porcentaje: number;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "igv")
    }
}
