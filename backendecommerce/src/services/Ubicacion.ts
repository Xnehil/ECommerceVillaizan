import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Ubicacion } from "../models/Ubicacion";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import ubicacionRepository from "src/repositories/Ubicacion";

class UbicacionService extends TransactionBaseService {
    protected ubicacionRepository_: typeof ubicacionRepository;

    constructor(container) {
        super(container);
        this.ubicacionRepository_ = container.ubicacionRepository;
    }

    getMessage() {
        return "Hello from UbicacionService";
    }

    async listar(): Promise<Ubicacion[]> {
        const ubicacionRepo = this.activeManager_.withRepository(this.ubicacionRepository_);
        return ubicacionRepo.find();
    }

    async listarYContar(
        selector: Selector<Ubicacion> = {},
        config: FindConfig<Ubicacion> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[Ubicacion[], number]> {
        const ubicacionRepo = this.activeManager_.withRepository(this.ubicacionRepository_);
        const query = buildQuery(selector, config);
        return ubicacionRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<Ubicacion>,
        config: FindConfig<Ubicacion> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<Ubicacion[]> {
        const [ubicacions] = await this.listarYContar(selector, config);
        return ubicacions;
    }

    async recuperar(
        id: string,
        config?: FindConfig<Ubicacion>
    ): Promise<Ubicacion> {
        const ubicacionRepo = this.activeManager_.withRepository(this.ubicacionRepository_);
        const query = buildQuery({ id }, config);
        const ubicacion = await ubicacionRepo.findOne(query);

        if (!ubicacion) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Ubicacion no encontrado");
        }

        return ubicacion;
    }

    async crear(ubicacion: Ubicacion): Promise<Ubicacion> {
        return this.atomicPhase_(async (manager) => {
            const ubicacionRepo = manager.withRepository(this.ubicacionRepository_);
            const ubicacionCreado = ubicacionRepo.create(ubicacion);
            const result = await ubicacionRepo.save(ubicacionCreado);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<Ubicacion>, "id">
    ): Promise<Ubicacion> {
        return await this.atomicPhase_(async (manager) => {
            const ubicacionRepo = manager.withRepository(this.ubicacionRepository_);
            const ubicacion = await this.recuperar(id);
            Object.assign(ubicacion, data);
            return await ubicacionRepo.save(ubicacion);
        });
    }

    async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            const ubicacionRepo = manager.withRepository(this.ubicacionRepository_);
            const ubicacion = await this.recuperar(id);
            await ubicacionRepo.update(id, { desactivadoEn: new Date(), estaActivo: false });
        });
    }
}

export default UbicacionService;
