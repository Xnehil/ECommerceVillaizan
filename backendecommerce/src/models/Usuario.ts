import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, BeforeInsert, OneToMany } from 'typeorm';
import { Persona } from './Persona';
import { EntidadBase } from './EntidadBase';
import { generateEntityId } from '@medusajs/medusa';
import { Rol } from './Rol';
import { Notificacion } from './Notificacion';

@Entity('vi_usuario')
export class Usuario extends EntidadBase {

    @Column({ type: 'varchar', length: 100, nullable: false })
    nombre: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    apellido: string;

    @Column({ type: 'boolean', nullable: false , name: "concuenta"})
    conCuenta: boolean;

    @Column({ type: 'varchar', length: 15, nullable: true , name: "numerotelefono"})
    numeroTelefono: string;

    @Column({ type: 'varchar', length: 150, nullable: false })
    correo: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    contrasena: string;

    @Column({ type: 'timestamp', nullable: true , name: "fechaultimologin"})
    fechaUltimoLogin: Date;

    //@Column({ type: 'varchar', length: 50, nullable: true })
    //id_persona: string;

    @Column({ type: 'varchar', length: 255, nullable: true , name: "imagenperfil"})
    imagenPerfil: string;

    @ManyToOne(() => Persona, persona => persona.id, {eager: true})
    @JoinColumn({ name: 'id_persona' })
    persona: Persona;

    @ManyToOne(() => Rol, rol => rol.id, {eager: true})
    @JoinColumn({ name: 'id_rol' })
    rol: Rol;
    
    @OneToMany(() => Notificacion, notificacion => notificacion.usuario)
    notificaciones: Notificacion[];

    @Column({ type: 'int', default: 0, name: "puntosacumulados" })
    puntosAcumulados: number;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "per")
    }

}