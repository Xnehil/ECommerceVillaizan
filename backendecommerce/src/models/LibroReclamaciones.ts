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

@Entity("vi_libroreclamaciones") 
export class LibroReclamaciones extends EntidadBase {

    @Column({ type: "timestamp", name: "fechaincidente" })
    fechaIncidente: Date;

    @Column({ type: "varchar", length: 100 })
    nombres: string;

    @Column({ type: "varchar", length: 100 })
    apellidos: string;

    @Column({ type: "varchar", length: 100 })
    correo: string;

    @Column({ type: "varchar", length: 20, nullable: true })
    telefono: string;

    @Column({ type: "varchar", length: 3, name: "tipodoc" })
    tipoDoc: string;

    @Column({ type: "varchar", length: 20, name: "nrdocumento" })
    nrDocumento: string;

    @Column({ type: "boolean", default: false })
    menor: boolean;

    @Column({ type: "varchar", length: 50 })
    departamento: string;

    @Column({ type: "varchar", length: 50 })
    provincia: string;

    @Column({ type: "varchar", length: 50 })
    distrito: string;

    @Column({ type: "varchar", length: 200 })
    direccion: string;

    @Column({ type: "varchar", length: 10 })
    tipo: string;

    @Column({ type: "decimal", precision: 10, scale: 2, name: "montoreclamado" })
    montoReclamado: number;

    @Column("text")
    descripcion: string;

    @Column({ type: "varchar", length: 7 })
    reclamacion: string;

    @Column({ type: "varchar", length: 50, nullable: true, name: "nrpedido" })
    nrPedido: string;

    @Column({ type: "timestamp", nullable: true, name: "fechapedido" })
    fechaPedido: Date;

    @Column("text", { nullable: true })
    detalle: string;

    @Column("text", { nullable: true, name: "pedidoconcreto" })
    pedidoConcreto: string;

    @Column({ type: "varchar", length: 200, nullable: true, name: "urlcomprobante" })
    urlComprobante: string;

    @Column("text", { nullable: true, name: "accionesproveedor" })
    accionesProveedor: string;

    @Column({ type: "boolean", default: true, name: "estaactivo" })
    estaActivo: boolean;

    @Column({ type: "varchar", length: 50, name: "usuariocreacion" })
    usuarioCreacion: string;

    @Column({ type: "varchar", length: 50, nullable: true, name: "usuarioactualizacion" })
    usuarioActualizacion: string;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "rec")
    }
}
