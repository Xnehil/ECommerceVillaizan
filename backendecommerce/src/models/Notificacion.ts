import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, ManyToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm"
import { EntidadBase } from "./EntidadBase"
import { generateEntityId } from "@medusajs/medusa"
import { Producto } from "./Producto";
import { ContenidoEducativo } from "./ContenidoEducativo";

@Entity("vi_notificacion")
export class Notificacion extends EntidadBase {
    @Column({ type: "varchar", length: 255 })
    asunto: string;

    @Column("text", { nullable: true })
    descripcion: string;

    @Column({ type: "varchar", length: 100, name: "tiponotificacion" })
    tipoNotificacion: string;

    @Column({ type: "boolean", default: false })
    leido: boolean;

    @Column({ type: "varchar", length: 50 })
    sistema: string;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "not");
    }
}