import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { InventarioMotorizado } from "../models/InventarioMotorizado";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import inventarioMotorizadoRepository from "src/repositories/InventarioMotorizado";

class InventarioMotorizadoService extends TransactionBaseService {
    protected inventarioMotorizadoRepository_: typeof inventarioMotorizadoRepository;

    constructor(container) {
        super(container);
        this.inventarioMotorizadoRepository_ = container.inventariomotorizadoRepository;
    }

    getMessage() {
        return "Hello from InventarioMotorizadoService";
    }

    async listar(): Promise<InventarioMotorizado[]> {
        const inventarioMotorizadoRepo = this.activeManager_.withRepository(this.inventarioMotorizadoRepository_);
        return inventarioMotorizadoRepo.find();
    }

    async listarYContar(
        selector: Selector<InventarioMotorizado> = {},
        config: FindConfig<InventarioMotorizado> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[InventarioMotorizado[], number]> {
        const inventarioMotorizadoRepo = this.activeManager_.withRepository(this.inventarioMotorizadoRepository_);
        const query = buildQuery(selector, config);
        return inventarioMotorizadoRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<InventarioMotorizado>,
        config: FindConfig<InventarioMotorizado> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<InventarioMotorizado[]> {
        const [inventarioMotorizados] = await this.listarYContar(selector, config);
        return inventarioMotorizados;
    }

    async recuperar(
        id: string,
        config?: FindConfig<InventarioMotorizado>
    ): Promise<InventarioMotorizado> {
        const inventarioMotorizadoRepo = this.activeManager_.withRepository(this.inventarioMotorizadoRepository_);
        const query = buildQuery({ id }, config);
        const inventarioMotorizado = await inventarioMotorizadoRepo.findOne(query);

        if (!inventarioMotorizado) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "InventarioMotorizado no encontrado");
        }

        return inventarioMotorizado;
    }

    async crear(inventarioMotorizado: InventarioMotorizado): Promise<InventarioMotorizado> {
        return this.atomicPhase_(async (manager) => {
            const inventarioMotorizadoRepo = manager.withRepository(this.inventarioMotorizadoRepository_);
            const inventarioMotorizadoCreado = inventarioMotorizadoRepo.create(inventarioMotorizado);
            const result = await inventarioMotorizadoRepo.save(inventarioMotorizadoCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<InventarioMotorizado>, "id">
    ): Promise<InventarioMotorizado> {
        return await this.atomicPhase_(async (manager) => {
            const inventarioMotorizadoRepo = manager.withRepository(this.inventarioMotorizadoRepository_);
            const inventarioMotorizado = await this.recuperar(id);
            Object.assign(inventarioMotorizado, data);
            return await inventarioMotorizadoRepo.save(inventarioMotorizado);
        });
    }

    async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            const inventarioMotorizadoRepo = manager.withRepository(this.inventarioMotorizadoRepository_);
            const inventarioMotorizado = await this.recuperar(id);
            await inventarioMotorizadoRepo.remove([inventarioMotorizado]);
        });
    }
}

export default InventarioMotorizadoService;
