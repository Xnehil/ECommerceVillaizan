import { 
    BeforeInsert, 
    Column, 
    Entity, 
    PrimaryColumn 
} from "typeorm";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { EntidadBase } from "./EntidadBase";

@Entity("vi_rol")
export class Rol extends EntidadBase {
    @PrimaryColumn({ length: 50 })
    id: string;

    @Column({ length: 100 })
    nombre: string;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "rol");
    }
}