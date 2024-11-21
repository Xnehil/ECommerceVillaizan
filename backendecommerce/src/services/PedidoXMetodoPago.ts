import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { PedidoXMetodoPago } from "../models/PedidoXMetodoPago";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import PedidoXMetodoPagoRepository from "src/repositories/PedidoXMetodoPago";

class PedidoXMetodoPagoService extends TransactionBaseService {
    protected pedidoXMetodoPagoRepository_: typeof PedidoXMetodoPagoRepository;

    constructor(container){
        super(container);
        this.pedidoXMetodoPagoRepository_ = container.pedidoxmetodopagoRepository;
    }

    getMessage() {
        return "Hello from PedidoXMetodoPagoService";
    }

    async listar(): Promise<PedidoXMetodoPago[]> {
        const pedidoXMetodoPagoRepo = this.activeManager_.withRepository(this.pedidoXMetodoPagoRepository_);
        return pedidoXMetodoPagoRepo.find();
    }

    async listarYContar(
        selector: Selector<PedidoXMetodoPago> ={},
        config: FindConfig<PedidoXMetodoPago> = {
          skip: 0,
          take: 20,
          relations: [],
        }
    ): Promise<[PedidoXMetodoPago[], number]> {
        const pedidoXMetodoPagoRepo = this.activeManager_.withRepository(this.pedidoXMetodoPagoRepository_);
        const query = buildQuery(selector, config);
        return pedidoXMetodoPagoRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<PedidoXMetodoPago>,
        config: FindConfig<PedidoXMetodoPago> = {
          skip: 0,
          take: 20,
          relations: ["pedido", "metodoPago"],
        }
    ): Promise<PedidoXMetodoPago[]> {
        const [pedidoXMetodoPagos] = await this.listarYContar(selector, config);
        return pedidoXMetodoPagos;
    }

    async recuperar(
        id: string,
        config?: FindConfig<PedidoXMetodoPago>
    ): Promise<PedidoXMetodoPago> {
        const pedidoXMetodoPagoRepo = this.activeManager_.withRepository(this.pedidoXMetodoPagoRepository_);
        config = { relations: ["pedido", "metodoPago"] };
        const query = buildQuery({ id, estaActivo:true }, config);
        const pedidoXMetodoPago = await pedidoXMetodoPagoRepo.findOne(query);

        if (!pedidoXMetodoPago) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "PedidoXMetodoPago no encontrado");
        }

        return pedidoXMetodoPago;
    }

    async crear(pedidoXMetodoPago: PedidoXMetodoPago): Promise<PedidoXMetodoPago> {
        return this.atomicPhase_(async (manager) => {
          const pedidoXMetodoPagoRepo = manager.withRepository(this.pedidoXMetodoPagoRepository_);
          const pedidoXMetodoPagoCreado = pedidoXMetodoPagoRepo.create(pedidoXMetodoPago);
          const result = await pedidoXMetodoPagoRepo.save(pedidoXMetodoPagoCreado);
          return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<PedidoXMetodoPago>, "id">
    ): Promise<PedidoXMetodoPago> {
        return await this.atomicPhase_(async (manager) => {
          const pedidoXMetodoPagoRepo = manager.withRepository(this.pedidoXMetodoPagoRepository_);
          const pedidoXMetodoPago = await this.recuperar(id);
          Object.assign(pedidoXMetodoPago, data);
          return await pedidoXMetodoPagoRepo.save(pedidoXMetodoPago);
        });
    }

    async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
          const pedidoXMetodoPagoRepo = manager.withRepository(this.pedidoXMetodoPagoRepository_);
          const pedidoXMetodoPago = await this.recuperar(id);
          if (!pedidoXMetodoPago) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "PedidoXMetodoPago no encontrado");
          }
          await pedidoXMetodoPagoRepo.update(id, {estaActivo: false, desactivadoEn: new Date()})
        });
    }

    async listarPorPedido(idPedido: string): Promise<PedidoXMetodoPago[]> {
        const pedidoXMetodoPagoRepo = this.activeManager_.withRepository(this.pedidoXMetodoPagoRepository_);

        const pedidoXMetodoPago = pedidoXMetodoPagoRepo.encontrarPorIdPedido(idPedido);
        if (!pedidoXMetodoPago) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "PedidoXMetodoPago no encontrado");
        }
        return pedidoXMetodoPago;
    }

}

export default PedidoXMetodoPagoService;