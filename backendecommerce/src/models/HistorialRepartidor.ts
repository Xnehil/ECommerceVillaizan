import { 
    BeforeInsert, 
    Column, 
    Entity, 
    JoinColumn, 
    JoinTable, 
    ManyToMany, 
    ManyToOne, 
    OneToMany, 
    PrimaryColumn,
  } from "typeorm"
  import { BaseEntity, SoftDeletableEntity } from "@medusajs/medusa"
  import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { EntidadBase } from "./EntidadBase"
import { TipoProducto } from "./TipoProducto";
import { Subcategoria } from "./Subcategoria";
import { Fruta } from "./Fruta";
import { InventarioMotorizado } from "./InventarioMotorizado";
import { Motorizado } from "./Motorizado";
import { Usuario } from "./Usuario";
import { Pedido } from "./Pedido";


@Entity("vi_historialrepartidor")
export class HistorialRepartidor extends EntidadBase {
    @Column({ length: 50 })
    estado: string;

    @Column({ length: 255, nullable: true , name: "razonderechazo" })
    razonDeRechazo: string;

    @ManyToOne(() => Motorizado, motorizado => motorizado.id)
    @JoinColumn({ name: "id_motorizado" })
    motorizado: Motorizado;

    @ManyToOne(() => Usuario, usuario => usuario.id)
    @JoinColumn({ name: "id_usuario" })
    usuario: Usuario;

    @ManyToOne(() => Pedido, pedido => pedido.id)
    @JoinColumn({ name: "id_pedido" })
    pedido: Pedido;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "hrep");
    }
}