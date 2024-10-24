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

    // @Column({ type: "varchar", length: 50, nullable: true, name: "id_motorizado" })
    // idMotorizado: string

    @ManyToOne(() => Motorizado, motorizado => motorizado.pedidos)
    @JoinColumn({ name: "id_motorizado" })
    motorizado: Motorizado;

    // @Column({ type: "varchar", length: 50, nullable: true, name: "id_direccion" })
    // idDireccion: string

    @ManyToOne(() => Direccion, direccion => direccion.id)
    @JoinColumn({ name: "id_direccion" })
    direccion: Direccion;

    // @Column({ type: "varchar", length: 50, nullable: true, name: "id_usuario" })
    // idUsuario: string

    @ManyToOne(() => Usuario, usuario => usuario.id)
    @JoinColumn({ name: "id_usuario" })
    usuario: Usuario;

    @ManyToMany(() => MetodoPago, metodoPago => metodoPago.pedidos)
    @JoinTable(
        {
            name: "vi_pedido_metodopago",
            joinColumn: { name: "id_pedido", referencedColumnName: "id" },
            inverseJoinColumn: { name: "id_metodopago", referencedColumnName: "id" }
        }
    )
    metodosPago: MetodoPago[];

    @OneToMany(() => DetallePedido, detallePedido => detallePedido.pedido)
    detalles: DetallePedido[];


    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "ped")
    }
}
