import { Entity, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";
import { EntidadBase } from "./EntidadBase";
import { Producto } from "./Producto"; // Adjust the import path if necessary
import { Almacen } from "./Almacen"; // Adjust the import path if necessary

@Entity("vi_inventarioalmacen")
export class InventarioAlmacen extends EntidadBase {
    @Column({ type: "int" })
    stock: number;

    @ManyToOne(() => Producto, producto => producto.id)
    @JoinColumn({ name: "producto_id" }) // Assuming this will be the foreign key column
    producto: Producto;

    @ManyToOne(() => Almacen, almacen => almacen.id)
    @JoinColumn({ name: "almacen_id" }) // Assuming this will be the foreign key column
    almacen: Almacen;
}
