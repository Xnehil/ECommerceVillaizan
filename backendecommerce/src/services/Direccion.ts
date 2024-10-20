import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Direccion } from "../models/Direccion";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import direccionRepository from "src/repositories/Direccion";

class DireccionService extends TransactionBaseService {
    protected direccionRepository_: typeof direccionRepository;

    constructor(container) {
        super(container);
        this.direccionRepository_ = container.direccionRepository;
    }

    getMessage() {
        return "Hello from DireccionService";
    }

    async listar(): Promise<Direccion[]> {
        const direccionRepo = this.activeManager_.withRepository(this.direccionRepository_);
        return direccionRepo.find();
    }

    async listarYContar(
        selector: Selector<Direccion> = {},
        config: FindConfig<Direccion> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[Direccion[], number]> {
        const direccionRepo = this.activeManager_.withRepository(this.direccionRepository_);
        const query = buildQuery(selector, config);
        return direccionRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<Direccion>,
        config: FindConfig<Direccion> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<Direccion[]> {
        const [direccions] = await this.listarYContar(selector, config);
        return direccions;
    }

    async recuperar(
        id: string,
        config?: FindConfig<Direccion>
    ): Promise<Direccion> {
        const direccionRepo = this.activeManager_.withRepository(this.direccionRepository_);
        const query = buildQuery({ id }, config);
        const direccion = await direccionRepo.findOne(query);

        if (!direccion) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Direccion no encontrado");
        }

        return direccion;
    }

    async crear(direccion: Direccion): Promise<Direccion> {
        return this.atomicPhase_(async (manager) => {
            const direccionRepo = manager.withRepository(this.direccionRepository_);
            const direccionCreado = direccionRepo.create(direccion);
            const result = await direccionRepo.save(direccionCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<Direccion>, "id">
    ): Promise<Direccion> {
        return await this.atomicPhase_(async (manager) => {
            const direccionRepo = manager.withRepository(this.direccionRepository_);
            const direccion = await this.recuperar(id);
            Object.assign(direccion, data);
            return await direccionRepo.save(direccion);
        });
    }

    async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            const direccionRepo = manager.withRepository(this.direccionRepository_);
            const direccion = await this.recuperar(id);
            await direccionRepo.update(id, { estaActivo: false , desactivadoEn: new Date() });
        });
    }
}

export default DireccionService;
