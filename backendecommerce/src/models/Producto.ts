import { 
    BeforeInsert, 
    Column, 
    Entity, 
    PrimaryColumn,
  } from "typeorm"
  import { BaseEntity, SoftDeletableEntity } from "@medusajs/medusa"
  import { generateEntityId } from "@medusajs/medusa/dist/utils"

@Entity() 
export class Producto extends SoftDeletableEntity {
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

    @Column({ default: true })
    estado: boolean

    @Column()
    usuarioCreacion: string

    @Column()
    usuarioActualizacion: string

    @Column({ default: false })
    seVendeEcommerce: boolean

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "prod")
    }
}