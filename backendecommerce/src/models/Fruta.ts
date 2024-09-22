import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, ManyToOne, JoinColumn, OneToMany, ManyToMany } from "typeorm"
import { EntidadBase } from "./EntidadBase"
import { generateEntityId } from "@medusajs/medusa"
import { Producto } from "./Producto";
import { ContenidoEducativo } from "./ContenidoEducativo";

@Entity("vi_fruta")
export class Fruta extends EntidadBase {
    @ManyToMany(() => Producto, producto => producto.frutas)
    productos: Producto[];

    @OneToMany(() => ContenidoEducativo, contenido => contenido.fruta)
    contenidosEducativos: ContenidoEducativo[];

    @Column({ type: "varchar", length: 255 })
    nombre: string;

    @Column({ type: "varchar", length: 255 , name: "urlimagen"})
    urlImagen: string;

    @Column("text", { nullable: true })
    descripcion: string;

    @Column("text", { nullable: true , name: "informacionnutricional"})
    informacionEducativa: string;


    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "frut");
    }
}