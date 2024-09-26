import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Pago } from "../models/Pago";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import pagoRepository from "src/repositories/Pago";

class PagoService extends TransactionBaseService {
    protected pagoRepository_: typeof pagoRepository;

    constructor(container) {
        super(container);
        this.pagoRepository_ = container.pagoRepository;
    }

    getMessage() {
        return "Hello from PagoService";
    }

    async listar(): Promise<Pago[]> {
        const pagoRepo = this.activeManager_.withRepository(this.pagoRepository_);
        return pagoRepo.find();
    }

    async listarYContar(
        selector: Selector<Pago> = {},
        config: FindConfig<Pago> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[Pago[], number]> {
        const pagoRepo = this.activeManager_.withRepository(this.pagoRepository_);
        const query = buildQuery(selector, config);
        return pagoRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<Pago>,
        config: FindConfig<Pago> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<Pago[]> {
        const [pagos] = await this.listarYContar(selector, config);
        return pagos;
    }

    async recuperar(
        id: string,
        config?: FindConfig<Pago>
    ): Promise<Pago> {
        const pagoRepo = this.activeManager_.withRepository(this.pagoRepository_);
        const query = buildQuery({ id }, config);
        const pago = await pagoRepo.findOne(query);

        if (!pago) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Pago no encontrado");
        }

        return pago;
    }

    async crear(pago: Pago): Promise<Pago> {
        return this.atomicPhase_(async (manager) => {
            const pagoRepo = manager.withRepository(this.pagoRepository_);
            const pagoCreado = pagoRepo.create(pago);
            const result = await pagoRepo.save(pagoCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<Pago>, "id">
    ): Promise<Pago> {
        return await this.atomicPhase_(async (manager) => {
            const pagoRepo = manager.withRepository(this.pagoRepository_);
            const pago = await this.recuperar(id);
            Object.assign(pago, data);
            return await pagoRepo.save(pago);
        });
    }

    async eliminar(id: string): Promise<Pago> {
        return await this.atomicPhase_(async (manager) => {
            const pagoRepo = manager.withRepository(this.pagoRepository_);
            const pago = await this.recuperar(id);
            pago.estaActivo = false;
            pago.desactivadoEn = new Date();
            return await pagoRepo.save(pago);
        });
    }
}

export default PagoService;
