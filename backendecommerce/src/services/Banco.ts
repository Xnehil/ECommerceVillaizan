import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Banco } from "../models/Banco";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import bancoRepository from "src/repositories/Banco";

class BancoService extends TransactionBaseService {
    protected bancoRepository_: typeof bancoRepository;

    constructor(container) {
        super(container);
        this.bancoRepository_ = container.bancoRepository;
    }

    getMessage() {
        return "Hello from BancoService";
    }

    async listar(): Promise<Banco[]> {
        const bancoRepo = this.activeManager_.withRepository(this.bancoRepository_);
        return bancoRepo.find();
    }

    async listarYContar(
        selector: Selector<Banco> = {},
        config: FindConfig<Banco> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[Banco[], number]> {
        const bancoRepo = this.activeManager_.withRepository(this.bancoRepository_);
        const query = buildQuery(selector, config);
        return bancoRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<Banco>,
        config: FindConfig<Banco> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<Banco[]> {
        const [bancos] = await this.listarYContar(selector, config);
        return bancos;
    }

    async recuperar(
        id: string,
        config?: FindConfig<Banco>
    ): Promise<Banco> {
        const bancoRepo = this.activeManager_.withRepository(this.bancoRepository_);
        const query = buildQuery({ id }, config);
        const banco = await bancoRepo.findOne(query);

        if (!banco) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Banco no encontrado");
        }

        return banco;
    }

    async crear(banco: Banco): Promise<Banco> {
        return this.atomicPhase_(async (manager) => {
            const bancoRepo = manager.withRepository(this.bancoRepository_);
            const bancoCreado = bancoRepo.create(banco);
            const result = await bancoRepo.save(bancoCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<Banco>, "id">
    ): Promise<Banco> {
        return await this.atomicPhase_(async (manager) => {
            const bancoRepo = manager.withRepository(this.bancoRepository_);
            const banco = await this.recuperar(id);
            Object.assign(banco, data);
            return await bancoRepo.save(banco);
        });
    }

    async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            const bancoRepo = manager.withRepository(this.bancoRepository_);
            const banco = await this.recuperar(id);
            await bancoRepo.remove([banco]);
        });
    }
}

export default BancoService;