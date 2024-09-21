import { 
    BeforeInsert, 
    Column, 
    Entity, 
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm"
import { BaseEntity, SoftDeletableEntity } from "@medusajs/medusa"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { EntidadBase } from "./EntidadBase"

@Entity("vi_libro_reclamaciones") 
export class LibroReclamaciones extends EntidadBase {
    @Column({ type: "timestamp" })
    fechaIncidente: Date

    @Column({ type: "varchar", length: 100 })
    nombres: string

    @Column({ type: "varchar", length: 100 })
    apellidos: string

    @Column({ type: "varchar", length: 100 })
    correo: string

    @Column({ type: "varchar", length: 20, nullable: true })
    telefono: string

    @Column({ type: "varchar", length: 3 })
    tipoDoc: string

    @Column({ type: "varchar", length: 20 })
    nrDocumento: string

    @Column({ type: "boolean", default: false })
    menor: boolean

    @Column({ type: "varchar", length: 50 })
    departamento: string

    @Column({ type: "varchar", length: 50 })
    provincia: string

    @Column({ type: "varchar", length: 50 })
    distrito: string

    @Column({ type: "varchar", length: 200 })
    direccion: string

    @Column({ type: "varchar", length: 10 })
    tipo: string

    @Column({ type: "decimal", precision: 10, scale: 2 })
    montoReclamado: number

    @Column("text")
    descripcion: string

    @Column({ type: "varchar", length: 7 })
    reclamacion: string

    @Column({ type: "varchar", length: 50, nullable: true })
    nrPedido: string

    @Column({ type: "timestamp", nullable: true })
    fechaPedido: Date

    @Column("text", { nullable: true })
    detalle: string

    @Column("text", { nullable: true })
    pedidoConcreto: string

    @Column({ type: "varchar", length: 200, nullable: true })
    urlComprobante: string

    @Column("text", { nullable: true })
    accionesProveedor: string

    @Column({ type: "boolean", default: true })
    estaActivo: boolean

    @Column({ type: "varchar", length: 50 })
    usuarioCreacion: string

    @Column({ type: "varchar", length: 50, nullable: true })
    usuarioActualizacion: string

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "rec")
    }
}
