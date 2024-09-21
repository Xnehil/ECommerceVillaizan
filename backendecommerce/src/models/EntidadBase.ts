import { BaseEntity } from "@medusajs/medusa";
import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column, PrimaryColumn } from "typeorm";

export abstract class EntidadBase{
    @PrimaryColumn({ type: "varchar", length: 50 })
    id: string;

    @CreateDateColumn({ type: "timestamp" })
    creadoEn: Date;

    @UpdateDateColumn({ type: "timestamp" })
    actualizadoEn: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    desactivadoEn: Date | null;

    @Column({ type: "varchar", length: 50 })
    usuarioCreacion: string;

    @Column({ type: "varchar", length: 50, nullable: true })
    usuarioActualizacion: string;
}