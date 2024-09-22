import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, ManyToOne, JoinColumn, ManyToMany } from "typeorm";
import { EntidadBase } from "./EntidadBase";
import { generateEntityId } from "@medusajs/medusa";
import { Producto } from "./Producto";
import { TipoProducto } from "./TipoProducto";

@Entity("vi_subcategoria")
export class Subcategoria extends EntidadBase {
    @ManyToOne(() => TipoProducto, tipoProducto => tipoProducto.subcategorias)
    @JoinColumn({ name: "id_tipoproducto" }) // Foreign key for TipoProducto
    tipoProducto: TipoProducto;

    @ManyToMany(() => Producto, producto => producto.subcategorias)
    productos: Producto[];

    @Column({ type: "varchar", length: 255 })
    nombre: string;


    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "tip");
    }
}
