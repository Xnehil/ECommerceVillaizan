import { Entity, PrimaryColumn, Column } from 'typeorm';
import { EntidadBase } from './EntidadBase';

@Entity('vi_persona')
export class Persona extends EntidadBase{

    @Column({ type: 'varchar', length: 5, nullable: false })
    tipoDocumento: string;

    @Column({ type: 'varchar', length: 20, nullable: false })
    numeroDocumento: string;

    @Column({ type: 'varchar', length: 255, nullable: true, name: "razoneliminacion" })
    razonEliminacion: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    estado: string;

}