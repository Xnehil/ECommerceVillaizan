import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Venta } from "../models/Venta";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import ventaRepository from "src/repositories/Venta";

class VentaService extends TransactionBaseService {
    protected ventaRepository_: typeof ventaRepository;

    constructor(container) {
        super(container);
        this.ventaRepository_ = container.ventaRepository;
    }

    getMessage() {
        return "Hello from VentaService";
    }

    async listar(): Promise<Venta[]> {
        const ventaRepo = this.activeManager_.withRepository(this.ventaRepository_);
        return ventaRepo.find();
    }

    async listarYContar(
        selector: Selector<Venta> = {},
        config: FindConfig<Venta> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<[Venta[], number]> {
        const ventaRepo = this.activeManager_.withRepository(this.ventaRepository_);
        const query = buildQuery(selector, config);
        return ventaRepo.findAndCount(query);
    }

    async listarConPaginacion(
        selector?: Selector<Venta>,
        config: FindConfig<Venta> = {
            skip: 0,
            take: 20,
            relations: [],
        }
    ): Promise<Venta[]> {
        const [ventas] = await this.listarYContar(selector, config);
        return ventas;
    }

    async recuperar(
        id: string,
        config?: FindConfig<Venta>
    ): Promise<Venta> {
        const ventaRepo = this.activeManager_.withRepository(this.ventaRepository_);
        const query = buildQuery({ id }, config);
        const venta = await ventaRepo.findOne(query);

        if (!venta) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Venta no encontrada");
        }

        return venta;
    }

    async crear(venta: Venta): Promise<Venta> {
        return this.atomicPhase_(async (manager) => {
            const ventaRepo = manager.withRepository(this.ventaRepository_);
            const ventaCreada = ventaRepo.create(venta);
            const result = await ventaRepo.save(ventaCreada);
            return result;
        });
    }

    async actualizar(
        id: string,
        data: Omit<Partial<Venta>, "id">
    ): Promise<Venta> {
        return await this.atomicPhase_(async (manager) => {
            const ventaRepo = manager.withRepository(this.ventaRepository_);
            const venta = await this.recuperar(id);
            Object.assign(venta, data);
            return await ventaRepo.save(venta);
        });
    }

    async eliminar(id: string): Promise<Venta> {
        return await this.atomicPhase_(async (manager) => {
            const ventaRepo = manager.withRepository(this.ventaRepository_);
            const venta = await this.recuperar(id);
            venta.estaActivo = false;
            venta.desactivadoEn = new Date();
            return await ventaRepo.save(venta);
        });
    }
}

export default VentaService;
