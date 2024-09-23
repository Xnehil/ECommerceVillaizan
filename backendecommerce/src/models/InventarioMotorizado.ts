import { Entity, PrimaryColumn, Column, ManyToOne, BeforeInsert, JoinColumn } from 'typeorm';
import { Motorizado } from './Motorizado';
import { Producto } from './Producto'; // Assuming Producto entity exists
import { EntidadBase } from './EntidadBase';
import { generateEntityId } from '@medusajs/medusa';

@Entity('vi_inventariomotorizado')
export class InventarioMotorizado extends EntidadBase {
  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'int', name: 'stockminimo' })
  stockMinimo: number;

  @Column({ type: 'boolean', default: false, name: 'esmerma' })
  esMerma: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true , name: 'motivomerma'})
  motivoMerma: string;

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'urlimagenmerma' })
  urlImagenMerma: string;

  @ManyToOne(() => Motorizado, motorizado => motorizado.inventarios)
  @JoinColumn({ name: 'id_motorizado' })
  motorizado: Motorizado;

  @ManyToOne(() => Producto, producto => producto.inventarios)
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;

  @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "invMot");
    }
}
