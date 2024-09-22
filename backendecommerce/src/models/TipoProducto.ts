import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, OneToMany, ManyToMany, JoinColumn, JoinTable } from "typeorm";
import { EntidadBase } from "./EntidadBase";
import { generateEntityId } from "@medusajs/medusa";
import { Subcategoria } from "./Subcategoria";
import { Producto } from "./Producto";

@Entity("vi_tipoproducto")
export class TipoProducto extends EntidadBase {
    // @OneToMany(() => Subcategoria, subcategoria => subcategoria.tipoProducto)
    // subcategorias: Subcategoria[];
    @ManyToMany(() => Subcategoria, subcategoria => subcategoria.tipoProducto)
    @JoinTable({
        name: "vi_tipoproducto_subcategoria", // Name of the join table
        joinColumn: {
          name: "tipoproducto_id",
          referencedColumnName: "id"
        },
        inverseJoinColumn: {
          name: "subcategoria_id",
          referencedColumnName: "id"
        },
        
      })
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
