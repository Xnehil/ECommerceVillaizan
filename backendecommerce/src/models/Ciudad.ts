import { Entity, PrimaryColumn, Column, OneToMany, BeforeInsert } from 'typeorm';
import { Direccion } from './Direccion';
import { EntidadBase } from './EntidadBase';
import { generateEntityId } from '@medusajs/medusa';

@Entity('vi_ciudad')
export class Ciudad extends EntidadBase {
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @OneToMany(() => Direccion, direccion => direccion.ciudad)
  direcciones: Direccion[];

  @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "ciud");
    }
}
