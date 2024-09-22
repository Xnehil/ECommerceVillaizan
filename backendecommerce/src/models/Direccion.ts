import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { EntidadBase } from './EntidadBase';
import { Ciudad } from './Ciudad';
import { Ubicacion } from './Ubicacion';

@Entity('vi_direccion')
export class Direccion extends EntidadBase {
  @Column({ type: 'varchar', length: 100 })
  calle: string;

  @Column({ type: 'varchar', length: 10 })
  numeroExterior: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  numeroInterior: string;

  @Column({ type: 'varchar', length: 50 })
  region: string;

  @Column({ type: 'varchar', length: 10 })
  codigoPostal: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  referencia: string;

  @ManyToOne(() => Ciudad, ciudad => ciudad.direcciones)
  ciudad: Ciudad;

  @ManyToOne(() => Ubicacion, ubicacion => ubicacion.direcciones)
  ubicacion: Ubicacion;
}
