import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Motorizado } from "../models/Motorizado";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import motorizadoRepository from "src/repositories/Motorizado";

class MotorizadoService extends TransactionBaseService {
    protected motorizadoRepository_: typeof motorizadoRepository;

    constructor(container) {
        super(container);
        this.motorizadoRepository_ = container.motorizadoRepository;
    }

    getMessage() {
        return "Hello from MotorizadoService";
    }

    async listar(): Promise<Motorizado[]> {
        const motorizadoRepo = this.activeManager_.withRepository(this.motorizadoRepository_);
        return motorizadoRepo.find();
    }

    async listarYContar(
        selector: Selector<Motorizado> = {},
        config: FindConfig<Motorizado> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[Motorizado[], number]> {
        const motorizadoRepo = this.activeManager_.withRepository(this.motorizadoRepository_);
        const query = buildQuery(selector, config);
        return motorizadoRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<Motorizado>,
        config: FindConfig<Motorizado> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<Motorizado[]> {
        const [motorizados] = await this.listarYContar(selector, config);
        return motorizados;
    }

    async recuperar(
        id: string,
        config?: FindConfig<Motorizado>
    ): Promise<Motorizado> {
        const motorizadoRepo = this.activeManager_.withRepository(this.motorizadoRepository_);
        const query = buildQuery({ id }, config);
        const motorizado = await motorizadoRepo.findOne(query);

        if (!motorizado) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Motorizado no encontrado");
        }

        return motorizado;
    }

    async crear(motorizado: Motorizado): Promise<Motorizado> {
        return this.atomicPhase_(async (manager) => {
            const motorizadoRepo = manager.withRepository(this.motorizadoRepository_);
            const motorizadoCreado = motorizadoRepo.create(motorizado);
            const result = await motorizadoRepo.save(motorizadoCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<Motorizado>, "id">
    ): Promise<Motorizado> {
        return await this.atomicPhase_(async (manager) => {
            const motorizadoRepo = manager.withRepository(this.motorizadoRepository_);
            const motorizado = await this.recuperar(id);
            Object.assign(motorizado, data);
            return await motorizadoRepo.save(motorizado);
        });
    }

    async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            const motorizadoRepo = manager.withRepository(this.motorizadoRepository_);
            const motorizado = await this.recuperar(id);
            await motorizadoRepo.remove([motorizado]);
        });
    }

    async listarPorUsuarioId(id_usuario: string): Promise<Motorizado> {
        const motorizadoRepo = this.activeManager_.withRepository(this.motorizadoRepository_);
        const motorizado = await motorizadoRepo.findByUsuarioId(id_usuario);
        if (!motorizado) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Motorizado no encontrado");
        }
        return motorizado;
    }
}

export default MotorizadoService;
