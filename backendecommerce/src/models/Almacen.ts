import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, OneToMany } from "typeorm";
import { EntidadBase } from "./EntidadBase";
import { generateEntityId } from "@medusajs/medusa";
import { Motorizado } from "./Motorizado";

@Entity("vi_almacen")
export class Almacen extends EntidadBase {

    @Column({ type: "varchar", length: 255 })
    nombre: string;

    @OneToMany(() => Motorizado, motorizado => motorizado.almacen)
    motorizados: Motorizado[];


    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "alm");
    }
}
