import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Igv } from "../models/Igv";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import IgvRepository from "src/repositories/Igv";

class IgvService extends TransactionBaseService {
    protected igvRepository_: typeof IgvRepository;

    constructor(container) {
        super(container);
        this.igvRepository_ = container.igvRepository;
    }

    getMessage() {
        return "Hello from IgvService";
    }

    async listar(): Promise<Igv[]> {
        const igvRepo = this.activeManager_.withRepository(this.igvRepository_);
        return igvRepo.find();
    }

    async listarYContar(
        selector: Selector<Igv> = {},
        config: FindConfig<Igv> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[Igv[], number]> {
        const igvRepo = this.activeManager_.withRepository(this.igvRepository_);
        const query = buildQuery(selector, config);
        return igvRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<Igv>,
        config: FindConfig<Igv> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<Igv[]> {
        const [igvs] = await this.listarYContar(selector, config);
        return igvs;
    }

    async recuperar(
        id: string,
        config?: FindConfig<Igv>
    ): Promise<Igv> {
        const igvRepo = this.activeManager_.withRepository(this.igvRepository_);
        const query = buildQuery({ id }, config);
        const igv = await igvRepo.findOne(query);

        if (!igv) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Igv no encontrado");
        }

        return igv;
    }

    async crear(igv: Igv): Promise<Igv> {
        return this.atomicPhase_(async (manager) => {
            const igvRepo = manager.withRepository(this.igvRepository_);
            const igvCreado = igvRepo.create(igv);
            const result = await igvRepo.save(igvCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<Igv>, "id">
    ): Promise<Igv> {
        return await this.atomicPhase_(async (manager) => {
            const igvRepo = manager.withRepository(this.igvRepository_);
            const igv = await this.recuperar(id);
            Object.assign(igv, data);
            return await igvRepo.save(igv);
        });
    }

    async eliminar(id: string): Promise<Igv> {
        return await this.atomicPhase_(async (manager) => {
            const igvRepo = manager.withRepository(this.igvRepository_);
            const igv = await this.recuperar(id);
            igv.estaActivo = false;
            igv.desactivadoEn = new Date();
            return await igvRepo.save(igv);
        });
    }
}

export default IgvService;
