import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { MetodoPago } from "../models/MetodoPago";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import metodopagoRepository from "src/repositories/MetodoPago";

class MetodoPagoService extends TransactionBaseService {
    protected metodoPagoRepository_: typeof metodopagoRepository;

    constructor(container) {
        super(container);
        this.metodoPagoRepository_ = container.metodopagoRepository;
    }

    getMessage() {
        return "Hello from MetodoPagoService";
    }

    async listar(): Promise<MetodoPago[]> {
        const metodoPagoRepo = this.activeManager_.withRepository(this.metodoPagoRepository_);
        return metodoPagoRepo.find();
    }

    async listarYContar(
        selector: Selector<MetodoPago> = {},
        config: FindConfig<MetodoPago> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[MetodoPago[], number]> {
        const metodoPagoRepo = this.activeManager_.withRepository(this.metodoPagoRepository_);
        const query = buildQuery(selector, config);
        return metodoPagoRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<MetodoPago>,
        config: FindConfig<MetodoPago> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<MetodoPago[]> {
        const [metodosPago] = await this.listarYContar(selector, config);
        return metodosPago;
    }

    async recuperar(
        id: string,
        config?: FindConfig<MetodoPago>
    ): Promise<MetodoPago> {
        const metodoPagoRepo = this.activeManager_.withRepository(this.metodoPagoRepository_);
        const query = buildQuery({ id }, config);
        const metodoPago = await metodoPagoRepo.findOne(query);

        if (!metodoPago) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "MetodoPago no encontrado");
        }

        return metodoPago;
    }

    async crear(metodoPago: MetodoPago): Promise<MetodoPago> {
        return this.atomicPhase_(async (manager) => {
            const metodoPagoRepo = manager.withRepository(this.metodoPagoRepository_);
            const metodoPagoCreado = metodoPagoRepo.create(metodoPago);
            const result = await metodoPagoRepo.save(metodoPagoCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<MetodoPago>, "id">
    ): Promise<MetodoPago> {
        return await this.atomicPhase_(async (manager) => {
            const metodoPagoRepo = manager.withRepository(this.metodoPagoRepository_);
            const metodoPago = await this.recuperar(id);
            Object.assign(metodoPago, data);
            return await metodoPagoRepo.save(metodoPago);
        });
    }

    async eliminar(id: string): Promise<MetodoPago> {
        return await this.atomicPhase_(async (manager) => {
            const metodoPagoRepo = manager.withRepository(this.metodoPagoRepository_);
            const metodoPago = await this.recuperar(id);
            metodoPago.estaActivo = false;
            metodoPago.desactivadoEn = new Date();
            return await metodoPagoRepo.save(metodoPago);
        });
    }
}

export default MetodoPagoService;
