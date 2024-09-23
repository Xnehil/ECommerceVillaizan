import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne, BeforeInsert, JoinColumn } from 'typeorm';
import { Almacen } from './Almacen'; // Assuming Almacen entity exists
import { Pedido } from './Pedido'; // Assuming Pedido entity exists
import { EntidadBase } from './EntidadBase';
import { InventarioMotorizado } from './InventarioMotorizado';
import { generateEntityId } from '@medusajs/medusa';

@Entity('vi_motorizado')
export class Motorizado extends EntidadBase {
  @Column({ type: 'varchar', length: 20 })
  placa: string;

  @ManyToOne(() => Almacen, almacen => almacen.motorizados)
  @JoinColumn({ name: 'id_almacen' })
  almacen: Almacen;

  @OneToMany(() => InventarioMotorizado, inventario => inventario.motorizado)
  inventarios: InventarioMotorizado[];

  @OneToMany(() => Pedido, pedido => pedido.motorizado)
  pedidos: Pedido[];

  @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "mot");
    }
}
