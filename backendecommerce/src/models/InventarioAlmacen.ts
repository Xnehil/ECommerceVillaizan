import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert } from "typeorm";
import { EntidadBase } from "./EntidadBase";
import { Producto } from "./Producto"; // Adjust the import path if necessary
import { Almacen } from "./Almacen"; // Adjust the import path if necessary
import { generateEntityId } from "@medusajs/medusa";

@Entity("vi_inventarioalmacen")
export class InventarioAlmacen extends EntidadBase {
    @Column({ type: "int" })
    stock: number;

    @ManyToOne(() => Producto, producto => producto.id)
    @JoinColumn({ name: "id_producto" }) // Assuming this will be the foreign key column
    producto: Producto;

    @ManyToOne(() => Almacen, almacen => almacen.id)
    @JoinColumn({ name: "id_almacen" }) // Assuming this will be the foreign key column
    almacen: Almacen;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "stk");
    }
}
