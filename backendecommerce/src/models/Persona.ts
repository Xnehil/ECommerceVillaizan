import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';
import { EntidadBase } from './EntidadBase';
import { generateEntityId } from '@medusajs/medusa';

@Entity('vi_persona')
export class Persona extends EntidadBase{

    @Column({ type: 'varchar', length: 5, nullable: false , name: "tipodocumento"})
    tipoDocumento: string;

    @Column({ type: 'varchar', length: 20, nullable: false , name: "numerodocumento"})
    numeroDocumento: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: "razoneliminacion" })
    razonEliminacion: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    estado: string;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "per")
    }
}