import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Direccion } from './Direccion';
import { EntidadBase } from './EntidadBase';

@Entity('vi_ciudad')
export class Ciudad extends EntidadBase {
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @OneToMany(() => Direccion, direccion => direccion.ciudad)
  direcciones: Direccion[];
}
