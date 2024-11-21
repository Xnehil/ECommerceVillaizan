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

    @Column({ type: "date", name: "fechainicio" }) 
    fechaInicio: Date;

    @Column({ type: "date", name: "fechafin" }) 
    fechaFin: Date;

    @Column({name: "limitestock"})
    limiteStock: number;

    @Column({name: "esvalido"})
    esValido: boolean;

    @Column("decimal", { precision: 5, scale: 2, name: "porcentajedescuento" })
    porcentajeDescuento: number;

    urlImagen?: string;

    textoInfo?: string;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "promo");
    }
}