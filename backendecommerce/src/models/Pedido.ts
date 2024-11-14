import { 
    BeforeInsert, 
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn, 
    ManyToMany,
    JoinTable,
    ManyToOne,
    JoinColumn,
    OneToMany
} from "typeorm"
import { generateEntityId } from "@medusajs/medusa/dist/utils"
import { EntidadBase } from "./EntidadBase"
import { MetodoPago } from "./MetodoPago";
import { Motorizado } from "./Motorizado";
import { Direccion } from "./Direccion";
import { DetallePedido } from "./DetallePedido";
import { Usuario } from "./Usuario";
import { Pago } from "./Pago";
import { PedidoXMetodoPago } from "./PedidoXMetodoPago";

@Entity("vi_pedido")
export class Pedido extends EntidadBase {

    @Column({ type: "varchar", length: 50, nullable: false })
    estado: string;

    @Column({ type: "varchar", length: 20, nullable: true, name: "prioridadentrega" })
    prioridadEntrega: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
    total: number;

    @Column({ type: "int", default: 0, name: "puntosotorgados" })
    puntosOtorgados: number;

    @Column("text", { nullable: true, name: "motivocancelacion" })
    motivoCancelacion: string;

    @Column({ type: "varchar", length: 100, nullable: true, name: "codigoseguimiento" })
    codigoSeguimiento: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: true, name: "montoefectivopagar" })
    montoEfectivoPagar: number;

    @Column({ type: "timestamp", nullable: true, name: "solicitadoen" })
    solicitadoEn: Date;

    @Column({ type: "timestamp", nullable: true, name: "verificadoen" })
    verificadoEn: Date;

    @Column({ type: "timestamp", nullable: true, name: "entregadoen" })
    entregadoEn: Date;

    @Column({ type: "varchar", length: 200, nullable: true, name: "urlevidencia" })
    urlEvidencia: string;

    // @Column({ type: "varchar", length: 50, nullable: true, name: "id_motorizado" })
    // idMotorizado: string

    @ManyToOne(() => Motorizado, motorizado => motorizado.pedidos, {eager: true})
    @JoinColumn({ name: "id_motorizado" })
    motorizado: Motorizado;

    // @Column({ type: "varchar", length: 50, nullable: true, name: "id_direccion" })
    // idDireccion: string

    @ManyToOne(() => Direccion, direccion => direccion.id, {eager: true})
    @JoinColumn({ name: "id_direccion" })
    direccion: Direccion;

    // @Column({ type: "varchar", length: 50, nullable: true, name: "id_usuario" })
    // idUsuario: string

    @ManyToOne(() => Usuario, usuario => usuario.id, {eager: true})
    @JoinColumn({ name: "id_usuario" })
    usuario: Usuario;

    @OneToMany(() => PedidoXMetodoPago, pedidoXMetodoPago => pedidoXMetodoPago.pedido, {eager: true})
    pedidosXMetodoPago: PedidoXMetodoPago[];

    @OneToMany(() => DetallePedido, detallePedido => detallePedido.pedido, {eager: true})
    detalles: DetallePedido[];

    @OneToMany(() => Pago, pago => pago.pedido)
    pagos: Pago[];

    @Column({ type: "boolean", nullable: false, default: false, name: "pagado" })
    pagado : boolean;

    @Column({ type: "timestamp", nullable: true, name: "pagadoen" })
    pagadoEn: Date;


    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "ped")
    }
}
