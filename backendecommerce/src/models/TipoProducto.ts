import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, OneToMany } from "typeorm";
import { EntidadBase } from "./EntidadBase";
import { generateEntityId } from "@medusajs/medusa";
import { Subcategoria } from "./Subcategoria";
import { Producto } from "./Producto";

@Entity("vi_tipoproducto")
export class TipoProducto extends EntidadBase {
    @OneToMany(() => Subcategoria, subcategoria => subcategoria.tipoProducto)
    subcategorias: Subcategoria[];

    @OneToMany(() => Producto, producto => producto.tipoProducto)
    productos: Producto[];

    @Column({ type: "varchar", length: 255 })
    nombre: string;


    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "tip");
    }
}
