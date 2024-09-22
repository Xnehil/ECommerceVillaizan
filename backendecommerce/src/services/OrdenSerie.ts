import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { OrdenSerie } from "../models/OrdenSerie";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import OrdenSerieRepository from "src/repositories/OrdenSerie";

class OrdenSerieService extends TransactionBaseService {
    protected ordenSerieRepository_: typeof OrdenSerieRepository;

    constructor(container) {
        super(container);
        this.ordenSerieRepository_ = container.ordenserieRepository; //importante dejar en minuscula antes de Repository
    }

    getMessage() {
        return "Hello from OrdenSerieService";
    }

    async listar(): Promise<OrdenSerie[]> {
        const ordenSerieRepo = this.activeManager_.withRepository(this.ordenSerieRepository_);
        return ordenSerieRepo.find();
    }

    async listarYContar(
        selector: Selector<OrdenSerie> = {},
        config: FindConfig<OrdenSerie> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[OrdenSerie[], number]> {
        const ordenSerieRepo = this.activeManager_.withRepository(this.ordenSerieRepository_);
        const query = buildQuery(selector, config);
        return ordenSerieRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<OrdenSerie>,
        config: FindConfig<OrdenSerie> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<OrdenSerie[]> {
        const [ordenSeries] = await this.listarYContar(selector, config);
        return ordenSeries;
    }

    async recuperar(
        id: string,
        config?: FindConfig<OrdenSerie>
    ): Promise<OrdenSerie> {
        const ordenSerieRepo = this.activeManager_.withRepository(this.ordenSerieRepository_);
        const query = buildQuery({ id }, config);
        const ordenSerie = await ordenSerieRepo.findOne(query);

        if (!ordenSerie) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "OrdenSerie no encontrado");
        }

        return ordenSerie;
    }

    async crear(ordenSerie: OrdenSerie): Promise<OrdenSerie> {
        return this.atomicPhase_(async (manager) => {
            const ordenSerieRepo = manager.withRepository(this.ordenSerieRepository_);
            const ordenSerieCreado = ordenSerieRepo.create(ordenSerie);
            const result = await ordenSerieRepo.save(ordenSerieCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<OrdenSerie>, "id">
    ): Promise<OrdenSerie> {
        return await this.atomicPhase_(async (manager) => {
            const ordenSerieRepo = manager.withRepository(this.ordenSerieRepository_);
            const ordenSerie = await this.recuperar(id);
            Object.assign(ordenSerie, data);
            return await ordenSerieRepo.save(ordenSerie);
        });
    }

    async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            const ordenSerieRepo = manager.withRepository(this.ordenSerieRepository_);
            const ordenSerie = await this.recuperar(id);
            await ordenSerieRepo.remove([ordenSerie]);
        });
    }
}

export default OrdenSerieService;
