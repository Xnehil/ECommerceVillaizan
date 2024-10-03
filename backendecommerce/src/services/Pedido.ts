import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Pedido } from "../models/Pedido";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import pedidoRepository from "src/repositories/Pedido";

class PedidoService extends TransactionBaseService {
    protected pedidoRepository_: typeof pedidoRepository;

    constructor(container) {
        super(container);
        this.pedidoRepository_ = container.pedidoRepository;
    }

    getMessage() {
        return "Hello from PedidoService";
    }

    async listar(): Promise<Pedido[]> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        return pedidoRepo.find();
    }

    async listarYContar(
        selector: Selector<Pedido> = {},
        config: FindConfig<Pedido> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[Pedido[], number]> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const query = buildQuery(selector, config);
        return pedidoRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<Pedido>,
        config: FindConfig<Pedido> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<Pedido[]> {
        const [pedidos] = await this.listarYContar(selector, config);
        return pedidos;
    }

    async recuperar(
        id: string,
        config?: FindConfig<Pedido>
    ): Promise<Pedido> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const query = buildQuery({ id }, config);
        const pedido = await pedidoRepo.findOne(query);

        if (!pedido) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }

        return pedido;
    }

    async recuperarConDetalle(id: string): Promise<Pedido> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const query = buildQuery({ id }, { relations: ["detalles"] });
        const pedido = await pedidoRepo.findOne(query);

        if (!pedido) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }

        return pedido;
    }

    async crear(pedido: Pedido): Promise<Pedido> {
        return this.atomicPhase_(async (manager) => {
            const pedidoRepo = manager.withRepository(this.pedidoRepository_);
            const pedidoCreado = pedidoRepo.create(pedido);
            const result = await pedidoRepo.save(pedidoCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<Pedido>, "id">
    ): Promise<Pedido> {
        return await this.atomicPhase_(async (manager) => {
            const pedidoRepo = manager.withRepository(this.pedidoRepository_);
            const pedido = await this.recuperar(id);
            Object.assign(pedido, data);
            return await pedidoRepo.save(pedido);
        });
    }

    async eliminar(id: string): Promise<Pedido> {
        return await this.atomicPhase_(async (manager) => {
            const pedidoRepo = manager.withRepository(this.pedidoRepository_);
            const pedido = await this.recuperar(id);
            pedido.estaActivo = false;
            pedido.desactivadoEn = new Date();
            return await pedidoRepo.save(pedido);
        });
    }

    async listarPorUsuario(idUsuario: string): Promise<Pedido[]> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const pedidos = await pedidoRepo.findByUsuarioId(idUsuario);

        if (!pedidos) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }

        return pedidos;
    }

    async listarPorMotorizado(idMotorizado: string): Promise<Pedido[]> {
        const pedidoRepo = this.activeManager_.withRepository(this.pedidoRepository_);
        const pedidos = await pedidoRepo.findByMotorizadoId(idMotorizado);

        if (!pedidos) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pedido no encontrado");
        }

        return pedidos;
    }

}

export default PedidoService;
