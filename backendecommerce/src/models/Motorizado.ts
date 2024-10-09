import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne, BeforeInsert, JoinColumn, OneToOne } from 'typeorm';
import { Almacen } from './Almacen'; // Assuming Almacen entity exists
import { Pedido } from './Pedido'; // Assuming Pedido entity exists
import { EntidadBase } from './EntidadBase';
import { InventarioMotorizado } from './InventarioMotorizado';
import { generateEntityId } from '@medusajs/medusa';
import { Usuario } from './Usuario';
import { Ciudad } from './Ciudad';

@Entity('vi_motorizado')
export class Motorizado extends EntidadBase {
  @Column({ type: 'varchar', length: 20 })
  placa: string;

  @Column({ type: 'varchar', length: 255 , name: 'urlimagen' })
  urlImagen: string;

  @ManyToOne(() => Almacen, almacen => almacen.motorizados)
  @JoinColumn({ name: 'id_almacen' })
  almacen: Almacen;

  @ManyToOne(() => Ciudad, ciudad => ciudad.id)
  @JoinColumn({ name: 'id_ciudad' })
  ciudad: Ciudad;

  @Column({ type: "boolean", default: true })
  disponible: boolean;

  @OneToOne(() => Usuario, usuario => usuario.id)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @OneToMany(() => InventarioMotorizado, inventario => inventario.motorizado)
  inventarios: InventarioMotorizado[];

  @OneToMany(() => Pedido, pedido => pedido.motorizado)
  pedidos: Pedido[];

  @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "mot");
    }
}
