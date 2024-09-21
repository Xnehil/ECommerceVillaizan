import { BaseEntity } from "@medusajs/medusa";
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column, PrimaryColumn } from "typeorm";

export abstract class EntidadBase{
    @PrimaryColumn({ type: "varchar", length: 50 })
    id: string;

    @CreateDateColumn({ type: "timestamp", name: "creadoen"})
    creadoEn: Date;

    @UpdateDateColumn({ type: "timestamp" , name: "actualizadoen"})
    actualizadoEn: Date;

    @DeleteDateColumn({ type: "timestamp", name: "desactivadoen", nullable: true })
    desactivadoEn: Date | null;

    @Column({ type: "varchar", name: "usuariocreacion", length: 50 })
    usuarioCreacion: string;

    @Column({ type: "varchar", name: "usuarioactualizacion", length: 50, nullable: true })
    usuarioActualizacion: string;
}