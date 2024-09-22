import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { DetallePedido } from "../models/DetallePedido";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import detallePedidoRepository from "src/repositories/DetallePedido";

class DetallePedidoService extends TransactionBaseService {
    protected detallePedidoRepository_: typeof detallePedidoRepository;

    constructor(container) {
        super(container);
        this.detallePedidoRepository_ = container.detallepedidoRepository;
    }

    getMessage() {
        return "Hello from DetallePedidoService";
    }

    async listar(): Promise<DetallePedido[]> {
        const detallePedidoRepo = this.activeManager_.withRepository(this.detallePedidoRepository_);
        return detallePedidoRepo.find();
    }

    async listarYContar(
        selector: Selector<DetallePedido> = {},
        config: FindConfig<DetallePedido> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[DetallePedido[], number]> {
        const detallePedidoRepo = this.activeManager_.withRepository(this.detallePedidoRepository_);
        const query = buildQuery(selector, config);
        return detallePedidoRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<DetallePedido>,
        config: FindConfig<DetallePedido> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<DetallePedido[]> {
        const [detallePedidos] = await this.listarYContar(selector, config);
        return detallePedidos;
    }

    async recuperar(
        id: string,
        config?: FindConfig<DetallePedido>
    ): Promise<DetallePedido> {
        const detallePedidoRepo = this.activeManager_.withRepository(this.detallePedidoRepository_);
        const query = buildQuery({ id }, config);
        const detallePedido = await detallePedidoRepo.findOne(query);

        if (!detallePedido) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "DetallePedido no encontrado");
        }

        return detallePedido;
    }

    async crear(detallePedido: DetallePedido): Promise<DetallePedido> {
        return this.atomicPhase_(async (manager) => {
            const detallePedidoRepo = manager.withRepository(this.detallePedidoRepository_);
            const detallePedidoCreado = detallePedidoRepo.create(detallePedido);
            const result = await detallePedidoRepo.save(detallePedidoCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<DetallePedido>, "id">
    ): Promise<DetallePedido> {
        return await this.atomicPhase_(async (manager) => {
            const detallePedidoRepo = manager.withRepository(this.detallePedidoRepository_);
            const detallePedido = await this.recuperar(id);
            Object.assign(detallePedido, data);
            return await detallePedidoRepo.save(detallePedido);
        });
    }

    async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            const detallePedidoRepo = manager.withRepository(this.detallePedidoRepository_);
            const detallePedido = await this.recuperar(id);
            await detallePedidoRepo.remove([detallePedido]);
        });
    }
}

export default DetallePedidoService;
