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
import { InventarioMotorizado } from "./InventarioMotorizado";
import { Promocion } from "./Promocion";
import { PlantillaProducto } from "./PlantillaProducto";

@Entity("vi_producto")
export class Producto extends EntidadBase {
    @ManyToOne(() => TipoProducto)
    @JoinColumn({ name: "id_tipoproducto" }) // Foreign key column for TipoProducto
    tipoProducto: TipoProducto;

    @ManyToMany(() => Subcategoria, subcategoria => subcategoria.productos)
    @JoinTable({
        name: "vi_producto_subcategoria", // Join table name
        joinColumn: { name: "id_producto", referencedColumnName: "id" },
        inverseJoinColumn: { name: "id_subcategoria", referencedColumnName: "id" }
    })
    subcategorias: Subcategoria[];

    @ManyToMany(() => Fruta, fruta => fruta.productos)
    @JoinTable({
        name: "vi_producto_fruta", // Join table name
        joinColumn: { name: "id_producto", referencedColumnName: "id" },
        inverseJoinColumn: { name: "id_fruta", referencedColumnName: "id" }
    })
    frutas: Fruta[];

    @OneToMany(() => InventarioMotorizado, inventario => inventario.producto)
    inventarios: InventarioMotorizado[];


    @Column({ unique: true })
    codigo: string

    @Column()
    nombre: string

    @Column("decimal", { precision: 10, scale: 2 , name: "precioa" })
    precioA: number

    @Column("decimal", { precision: 10, scale: 2 , name: "preciob" })
    precioB: number

    @Column("decimal", { precision: 10, scale: 2, name: "precioc" })
    precioC: number

    @Column("decimal", { precision: 10, scale: 2 , name: "precioecommerce"})
    precioEcommerce: number

    @Column({name: "urlimagen"})
    urlImagen: string

    @Column("text", { nullable: true })
    descripcion: string

    @Column("text", { nullable: true , name: "informacionnutricional"})
    informacionNutricional: string

    @Column("text", { nullable: true, name: "razoneliminacion" })
    razonEliminacion: string

    @Column({ default: false , name: "sevendeecommerce"})
    seVendeEcommerce: boolean

    @Column({ name: "stockseguridad" , default: 0})
    stockSeguridad: number

    @ManyToOne(() => Promocion, promocion => promocion.id, { eager: true })
    @JoinColumn({ name: "id_promocion" })
    promocion: Promocion;

    
    @OneToMany(() => PlantillaProducto, plantillaProducto => plantillaProducto.producto)
    productoPlantillas: PlantillaProducto[];
    /*  @ManyToOne(() => Ciudad, ciudad => ciudad.direcciones, { eager: true })
  @JoinColumn({ name: 'id_ciudad' })
  ciudad: Ciudad;*/

    cantidadPuntos?: number;

    @Column({ name: "id_crm", nullable: true })
    idCRM: string;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "prod")
    }
}