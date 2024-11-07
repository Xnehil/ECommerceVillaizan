import { 
    BeforeInsert, 
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToMany,
    JoinTable,
    OneToMany
} from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { EntidadBase } from "./EntidadBase"
import { Producto } from "./Producto";
import { PlantillaProducto } from "./PlantillaProducto";

@Entity("vi_plantillamotorizado")
export class Plantilla extends EntidadBase {

    @Column({ type: "varchar", length: 255, nullable: false })
    nombre: string;

    @Column("text", { nullable: true })
    descripcion: string;

    // Creo que usar cascade era más fácil, pero fuep. Ya está hecho.
    @OneToMany(() => PlantillaProducto, plantillaProducto => plantillaProducto.plantilla)
    productos: PlantillaProducto[];

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "pln")
    }
}
