import { 
    BeforeInsert, 
    Column, 
    Entity, 
    JoinColumn, 
    JoinTable, 
    ManyToMany, 
    ManyToOne, 
    OneToMany, 
    PrimaryColumn,
  } from "typeorm"
  import { BaseEntity, SoftDeletableEntity } from "@medusajs/medusa"
  import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { EntidadBase } from "./EntidadBase"
import { TipoProducto } from "./TipoProducto";
import { Subcategoria } from "./Subcategoria";
import { Fruta } from "./Fruta";

@Entity("vi_producto")
export class Producto extends EntidadBase {
    @ManyToOne(() => TipoProducto)
    @JoinColumn({ name: "id_tipoproducto" }) // Foreign key column for TipoProducto
    tipoProducto: TipoProducto;

    @ManyToMany(() => Subcategoria, subcategoria => subcategoria.productos)
    @JoinTable({
        name: "vi_producto_subcategoria", // Join table name
        joinColumn: { name: "producto_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "subcategoria_id", referencedColumnName: "id" }
    })
    subcategorias: Subcategoria[];

    @ManyToMany(() => Fruta, fruta => fruta.productos)
    @JoinTable({
        name: "vi_producto_fruta", // Join table name
        joinColumn: { name: "producto_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "fruta_id", referencedColumnName: "id" }
    })
    frutas: Fruta[];

    @Column({ unique: true })
    codigo: string

    @Column()
    nombre: string

    @Column("decimal", { precision: 10, scale: 2 })
    precioA: number

    @Column("decimal", { precision: 10, scale: 2 })
    precioB: number

    @Column("decimal", { precision: 10, scale: 2 })
    precioC: number

    @Column()
    urlImagen: string

    @Column({ type: "int" })
    cantMinPed: number

    @Column({ type: "int" })
    cantMaxPed: number

    @Column("text", { nullable: true })
    descripcion: string

    @Column("text", { nullable: true })
    informacionNutricional: string

    @Column("text", { nullable: true })
    razonEliminacion: string

    @Column({ default: false })
    seVendeEcommerce: boolean

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "prod")
    }
}