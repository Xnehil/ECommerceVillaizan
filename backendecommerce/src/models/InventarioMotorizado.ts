import { Entity, PrimaryColumn, Column, ManyToOne } from 'typeorm';
import { Motorizado } from './Motorizado';
import { Producto } from './Producto'; // Assuming Producto entity exists
import { EntidadBase } from './EntidadBase';

@Entity('vi_inventariomotorizado')
export class InventarioMotorizado extends EntidadBase {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  id: string;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'int' })
  stockMinimo: number;

  @Column({ type: 'boolean', default: false })
  esMerma: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  motivoMerma: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  urlImagenMerma: string;

  @ManyToOne(() => Motorizado, motorizado => motorizado.inventarios)
  motorizado: Motorizado;

  @ManyToOne(() => Producto, producto => producto.inventarios)
  producto: Producto;
}
