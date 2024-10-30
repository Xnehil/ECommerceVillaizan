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
import { Venta } from "./Venta";
import { MetodoPago } from "./MetodoPago";
import { Banco } from "./Banco";
import { Pedido } from "./Pedido";

@Entity("vi_pago")
export class Pago extends EntidadBase {

    @Column({ type: "boolean", nullable: false, name: "estransferencia" })
    esTransferencia: boolean;

    @Column({ type: "decimal", precision: 10, scale: 2, nullable: false, name: "montocobrado" })
    montoCobrado: number;

    @Column({ type: "varchar", length: 50, nullable: true, name: "numerooperacion" })
    numeroOperacion: string;

    @Column({ type: "varchar", length: 200, nullable: true, name: "urlevidencia" })
    urlEvidencia: string;

    @Column({ type: "varchar", length: 100, nullable: true, name: "codigotransaccion" })
    codigoTransaccion: string;

    //@Column({ type: "varchar", length: 50, nullable: true, name: "id_venta" })
    //idVenta: string;

    // Foreign key relationship for id_venta can be added when the Venta entity is defined
    @ManyToOne(() => Venta, venta => venta.id)
    @JoinColumn({ name: "id_venta" })
    venta: Venta;

    //@Column({ type: "varchar", length: 50, nullable: true, name: "id_metodopago" })
    //idMetodoPago: string;

    // Foreign key relationship for id_metodopago can be added when the MetodoPago entity is defined
    @ManyToOne(() => MetodoPago, metodoPago => metodoPago.id)
    @JoinColumn({ name: "id_metodopago" })
    metodoPago: MetodoPago;

    //@Column({ type: "varchar", length: 50, nullable: true, name: "id_banco" })
    //idBanco: string;

    // Foreign key relationship for id_banco can be added when the Banco entity is defined
    @ManyToOne(() => Banco, banco => banco.id)
    @JoinColumn({ name: "id_banco" })
    banco: Banco;

    @ManyToOne(() => Pedido, pedido => pedido.id)
    @JoinColumn({ name: "id_pedido" })
    pedido: Pedido;

    @BeforeInsert()
    private beforeInsert() {
        this.id = generateEntityId(this.id, "pag");
    }
}
