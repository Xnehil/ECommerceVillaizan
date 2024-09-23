import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Ciudad } from "../models/Ciudad";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import ciudadRepository from "src/repositories/Ciudad";

class CiudadService extends TransactionBaseService {
    protected ciudadRepository_: typeof ciudadRepository;

    constructor(container) {
        super(container);
        this.ciudadRepository_ = container.ciudadRepository;
    }

    getMessage() {
        return "Hello from CiudadService";
    }

    async listar(): Promise<Ciudad[]> {
        const ciudadRepo = this.activeManager_.withRepository(this.ciudadRepository_);
        return ciudadRepo.find();
    }

    async listarYContar(
        selector: Selector<Ciudad> = {},
        config: FindConfig<Ciudad> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[Ciudad[], number]> {
        const ciudadRepo = this.activeManager_.withRepository(this.ciudadRepository_);
        const query = buildQuery(selector, config);
        return ciudadRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<Ciudad>,
        config: FindConfig<Ciudad> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<Ciudad[]> {
        const [ciudads] = await this.listarYContar(selector, config);
        return ciudads;
    }

    async recuperar(
        id: string,
        config?: FindConfig<Ciudad>
    ): Promise<Ciudad> {
        const ciudadRepo = this.activeManager_.withRepository(this.ciudadRepository_);
        const query = buildQuery({ id }, config);
        const ciudad = await ciudadRepo.findOne(query);

        if (!ciudad) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Ciudad no encontrado");
        }

        return ciudad;
    }

    async crear(ciudad: Ciudad): Promise<Ciudad> {
        return this.atomicPhase_(async (manager) => {
            const ciudadRepo = manager.withRepository(this.ciudadRepository_);
            const ciudadCreado = ciudadRepo.create(ciudad);
            const result = await ciudadRepo.save(ciudadCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<Ciudad>, "id">
    ): Promise<Ciudad> {
        return await this.atomicPhase_(async (manager) => {
            const ciudadRepo = manager.withRepository(this.ciudadRepository_);
            const ciudad = await this.recuperar(id);
            Object.assign(ciudad, data);
            return await ciudadRepo.save(ciudad);
        });
    }

    async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            const ciudadRepo = manager.withRepository(this.ciudadRepository_);
            const ciudad = await this.recuperar(id);
            await ciudadRepo.remove([ciudad]);
        });
    }
}

export default CiudadService;
