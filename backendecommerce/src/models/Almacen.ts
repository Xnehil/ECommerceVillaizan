import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert } from "typeorm";
import { EntidadBase } from "./EntidadBase";
import { generateEntityId } from "@medusajs/medusa";

@Entity("vi_almacen")
export class Almacen extends EntidadBase {

    @Column({ type: "varchar", length: 255 })
    nombre: string;


    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "tip");
    }
}
