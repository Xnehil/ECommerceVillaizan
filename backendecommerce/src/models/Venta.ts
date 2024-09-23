import { 
    BeforeInsert, 
    Column, 
    Entity, 
    CreateDateColumn, 
    UpdateDateColumn, 
    PrimaryGeneratedColumn, 
    ManyToOne,
    JoinColumn
} from "typeorm";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { EntidadBase } from "./EntidadBase";
import { Pedido } from "./Pedido";
import { OrdenSerie } from "./OrdenSerie";

@Entity("vi_venta")
export class Venta extends EntidadBase {

    @Column({ type: "varchar", length: 10, nullable: false, name: "tipocomprobante" })
    tipoComprobante: string;

    @Column({ type: "timestamp", nullable: false, name: "fechaventa" })
    fechaVenta: Date;

    @Column({ type: "varchar", length: 50, nullable: false, name: "numerocomprobante" })
    numeroComprobante: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false, name: "montototal" })
    montoTotal: number;

    @Column({ type: "int", nullable: false, name: "totalpaletas" })
    totalPaletas: number;

    @Column({ type: "int", nullable: false, name: "totalmafeletas" })
    totalMafelitas: number;

    @Column({ type: "varchar", length: 50, nullable: false })
    estado: string;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false, name: "totaligv" })
    totalIgv: number;

    //@Column({ type: "varchar", length: 50, nullable: true, name: "id_pedido" })
    //idPedido: string;

    // Foreign key relationship for id_pedido can be added when the Pedido entity is defined
    @ManyToOne(() => Pedido, pedido => pedido.id)
    @JoinColumn({ name: "id_pedido" })
    pedido: Pedido;

    //@Column({ type: "varchar", length: 50, nullable: true, name: "id_ordenserie" })
    //idOrdenSerie: string;

    // Foreign key relationship for id_ordenserie can be added when the OrdenSerie entity is defined
    @ManyToOne(() => OrdenSerie, ordenSerie => ordenSerie.id)
    @JoinColumn({ name: "id_ordenserie" })
    ordenSerie: OrdenSerie;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "ven");
    }
}
