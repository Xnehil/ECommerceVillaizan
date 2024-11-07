import { 
    BeforeInsert, 
    Column, 
    Entity, 
    PrimaryGeneratedColumn 
} from "typeorm";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { EntidadBase } from "./EntidadBase";

@Entity("vi_promocion")
export class Promocion extends EntidadBase {
    @Column()
    titulo: string;

    @Column("text")
    descripcion: string;

    @Column({ type: "timestamp", name: "fechainicio" })
    fechaInicio: Date;

    @Column({ type: "timestamp", name: "fechafin" })
    fechaFin: Date;

    @Column({name: "limitestock"})
    limiteStock: number;

    @Column("decimal", { precision: 5, scale: 2, name: "porcentajedescuento" })
    porcentajeDescuento: number;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "promo");
    }
}