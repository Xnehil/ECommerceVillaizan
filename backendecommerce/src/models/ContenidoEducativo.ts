import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, ManyToOne, JoinColumn } from "typeorm";
import { EntidadBase } from "./EntidadBase";
import { generateEntityId } from "@medusajs/medusa";
import { Fruta } from "./Fruta";

@Entity("vi_contenidoeducativo")
export class ContenidoEducativo extends EntidadBase {
    @ManyToOne(() => Fruta, fruta => fruta.contenidosEducativos, { eager: true })
    @JoinColumn({ name: "id_fruta" }) // Foreign key for Fruta
    fruta: Fruta;

    @Column({ type: "varchar", length: 255 })
    titulo: string;

    @Column("text", { nullable: true })
    contenidoinformacion: string;

    @Column({ type: "varchar", length: 100, name: "tipocontenido" })
    tipoContenido: string;

    @Column({ type: "varchar", length: 255, name: "urlcontenido" })
    URLContenido: string;

    @Column({ type: "timestamp", name: "fechapublicacion" })
    fechaPublicacion: Date;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "cont");
    }
}
