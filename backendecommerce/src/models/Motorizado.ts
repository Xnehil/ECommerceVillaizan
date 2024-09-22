import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Almacen } from './Almacen'; // Assuming Almacen entity exists
import { Pedido } from './Pedido'; // Assuming Pedido entity exists
import { EntidadBase } from './EntidadBase';
import { InventarioMotorizado } from './InventarioMotorizado';

@Entity('vi_motorizado')
export class Motorizado extends EntidadBase {
  @Column({ type: 'varchar', length: 20 })
  placa: string;

  @ManyToOne(() => Almacen, almacen => almacen.motorizados)
  almacen: Almacen;

  @OneToMany(() => InventarioMotorizado, inventario => inventario.motorizado)
  inventarios: InventarioMotorizado[];

  @OneToMany(() => Pedido, pedido => pedido.motorizado)
  pedidos: Pedido[];
}
