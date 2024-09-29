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

        //console.log('Executing query with selector:', selector);
        //console.log('Executing query with config:', config);
        //console.log('Generated query:', query);

        const result = await bancoRepo.findAndCount(query);

        //console.log('Query result:', result);

        //const bancoRepo = this.activeManager_.withRepository(this.bancoRepository_);
        //const result = await bancoRepo.find();
        //console.log('Direct query result:', result);

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

        if (selector) {
            console.log('Selector is not empty:', selector);
        } else {
            console.log('Selector is empty');
        }
    
        if (config) {
            console.log('Config is not empty:', config);
        } else {
            console.log('Config is empty');
        }

        const [bancos] = await this.listarYContar(selector, config);
        console.log('Bancos:', bancos);
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

    async eliminar(id: string): Promise<Banco> {
        return await this.atomicPhase_(async (manager) => {
            const bancoRepo = manager.withRepository(this.bancoRepository_);
            const banco = await this.recuperar(id);
            banco.estaActivo = false;
            banco.desactivadoEn = new Date();
            return await bancoRepo.save(banco);
        });
    }
}

export default BancoService;
