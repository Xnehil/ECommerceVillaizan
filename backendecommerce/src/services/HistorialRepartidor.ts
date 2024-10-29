import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { HistorialRepartidor } from "../models/HistorialRepartidor";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import HistorialRepartidorRepository from "src/repositories/HistorialRepartidor";

class HistorialRepartidorService extends TransactionBaseService {
    protected historialRepartidorRepository_: typeof HistorialRepartidorRepository;

    constructor(container) {
        super(container);
        this.historialRepartidorRepository_ = container.historialrepartidorRepository;
    }

    getMessage() {
        return "Hello from HistorialRepartidorService";
    }

    async listar(): Promise<HistorialRepartidor[]> {
        const historialRepo = this.activeManager_.withRepository(this.historialRepartidorRepository_);
        return historialRepo.find();
    }

    async listarYContar(
        selector: Selector<HistorialRepartidor> = {},
        config: FindConfig<HistorialRepartidor> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[HistorialRepartidor[], number]> {
        const historialRepo = this.activeManager_.withRepository(this.historialRepartidorRepository_);
        const query = buildQuery(selector, config);
        return historialRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<HistorialRepartidor>,
        config: FindConfig<HistorialRepartidor> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<HistorialRepartidor[]> {
        const [historiales] = await this.listarYContar(selector, config);
        return historiales;
    }

    async recuperar(
        id: string,
        config?: FindConfig<HistorialRepartidor>
    ): Promise<HistorialRepartidor> {
        const historialRepo = this.activeManager_.withRepository(this.historialRepartidorRepository_);
        const query = buildQuery({ id }, config);
        const historial = await historialRepo.findOne(query);

        if (!historial) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "HistorialRepartidor no encontrado");
        }

        return historial;
    }

    async crear(historial: HistorialRepartidor): Promise<HistorialRepartidor> {
        return this.atomicPhase_(async (manager) => {
            const historialRepo = manager.withRepository(this.historialRepartidorRepository_);
            const historialCreado = historialRepo.create(historial);
            const result = await historialRepo.save(historialCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<HistorialRepartidor>, "id">
    ): Promise<HistorialRepartidor> {
        return await this.atomicPhase_(async (manager) => {
            const historialRepo = manager.withRepository(this.historialRepartidorRepository_);
            const historial = await this.recuperar(id);
            Object.assign(historial, data);
            return await historialRepo.save(historial);
        });
    }

    async eliminar(id: string): Promise<HistorialRepartidor> {
        return await this.atomicPhase_(async (manager) => {
            const historialRepo = manager.withRepository(this.historialRepartidorRepository_);
            const historial = await this.recuperar(id);
            historial.estaActivo = false;
            historial.desactivadoEn = new Date();
            return await historialRepo.save(historial);
        });
    }
}

export default HistorialRepartidorService;