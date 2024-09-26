import { Entity, PrimaryColumn, Column, ManyToOne, BeforeInsert, JoinColumn } from 'typeorm';
import { EntidadBase } from './EntidadBase';
import { Ciudad } from './Ciudad';
import { Ubicacion } from './Ubicacion';
import { generateEntityId } from '@medusajs/medusa';

@Entity('vi_direccion')
export class Direccion extends EntidadBase {
  @Column({ type: 'varchar', length: 100 })
  calle: string;

  @Column({ type: 'varchar', length: 10 , name: 'numeroexterior'})
  numeroExterior: string;

  @Column({ type: 'varchar', length: 10, nullable: true, name: 'numerointerior' })
  numeroInterior: string;

  @Column({ type: 'varchar', length: 50 })
  region: string;

  @Column({ type: 'varchar', length: 10, name: 'codigopostal' })
  codigoPostal: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referencia: string;

  @ManyToOne(() => Ciudad, ciudad => ciudad.direcciones, { eager: true })
  @JoinColumn({ name: 'id_ciudad' })
  ciudad: Ciudad;

  @ManyToOne(() => Ubicacion, ubicacion => ubicacion.direcciones, { eager: true })
  @JoinColumn({ name: 'id_ubicacion' })
  ubicacion: Ubicacion;

  @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "dir");
    }
}
