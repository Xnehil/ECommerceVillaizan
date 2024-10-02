import { Entity, PrimaryColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
import { Direccion } from './Direccion';
import { EntidadBase } from './EntidadBase';
import { generateEntityId } from '@medusajs/medusa';

@Entity('vi_ubicacion')
export class Ubicacion extends EntidadBase {
  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitud: number;

  @Column({ type: 'decimal', precision: 11, scale: 8 })
  longitud: number;


  @OneToMany(() => Direccion, direccion => direccion.ubicacion)
  direcciones: Direccion[];

  @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "ubi");
    }
}
