import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Direccion } from './Direccion';
import { EntidadBase } from './EntidadBase';

@Entity('vi_ubicacion')
export class Ubicacion extends EntidadBase {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitud: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitud: number;


  @OneToMany(() => Direccion, direccion => direccion.ubicacion)
  direcciones: Direccion[];
}
