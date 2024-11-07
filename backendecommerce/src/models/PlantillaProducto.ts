import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, BeforeInsert } from "typeorm";
import { Plantilla } from "./Plantilla";
import { Producto } from "./Producto";
import { EntidadBase } from "./EntidadBase";
import { generateEntityId } from "@medusajs/medusa";

@Entity("vi_plantillamotorizado_producto")
export class PlantillaProducto extends EntidadBase {

  @ManyToOne(() => Plantilla, plantilla => plantilla.productos)
  @JoinColumn({ name: "id_plantillamotorizado" })
  plantilla: Plantilla;

  @ManyToOne(() => Producto, producto => producto.productoPlantillas)
  @JoinColumn({ name: "id_producto" })
  producto: Producto;

  @Column({nullable: false})
  cantidad: number;

  @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "prpln")
    }
}