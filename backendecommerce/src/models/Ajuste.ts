import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BeforeInsert, OneToMany } from "typeorm";
import { EntidadBase } from "./EntidadBase";
import { generateEntityId } from "@medusajs/medusa";
import { Motorizado } from "./Motorizado";

@Entity("vi_ajustes_ecommerce")
export class Ajuste extends EntidadBase {
    // id VARCHAR(50) PRIMARY KEY,           
    // llave VARCHAR(255) NOT NULL UNIQUE, 
    // valor TEXT NOT NULL,            
    // tag VARCHAR(100),               
    // descripcion TEXT,    
    @Column({ type: "varchar", length: 255, unique: true })
    llave: string;

    @Column({ type: "text" , nullable: false})
    valor: string;

    @Column({ type: "varchar", length: 100, nullable: true })
    tag: string;

    @Column({ type: "text", nullable: true })
    descripcion: string;


    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "ajs");
    }
}
