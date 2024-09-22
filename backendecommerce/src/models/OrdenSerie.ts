import { 
    BeforeInsert, 
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn 
} from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { EntidadBase } from "./EntidadBase"

@Entity("vi_ordenserie")
export class OrdenSerie extends EntidadBase {

    @Column({ type: "varchar", length: 10, nullable: false })
    nombre: string;

    @Column("text", { nullable: true })
    descripcion: string;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "osr")
    }
}
