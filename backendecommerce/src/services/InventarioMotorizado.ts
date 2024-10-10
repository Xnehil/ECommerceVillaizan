import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { InventarioMotorizado } from "../models/InventarioMotorizado";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils";
import inventarioMotorizadoRepository from "src/repositories/InventarioMotorizado";
import MotorizadoRepository from "@repositories/Motorizado";

class InventarioMotorizadoService extends TransactionBaseService {
    protected inventarioMotorizadoRepository_: typeof inventarioMotorizadoRepository;
    protected motorizadoRepository_: typeof MotorizadoRepository;

    constructor(container) {
        super(container);
        this.inventarioMotorizadoRepository_ = container.inventariomotorizadoRepository;
        this.motorizadoRepository_ = container.motorizadoRepository;
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

    async eliminar(id: string): Promise<InventarioMotorizado> {
        return await this.atomicPhase_(async (manager) => {
            const inventarioMotorizadoRepo = manager.withRepository(this.inventarioMotorizadoRepository_);
            const inventarioMotorizado = await this.recuperar(id);
            inventarioMotorizado.estaActivo = false;
            inventarioMotorizado.desactivadoEn = new Date();
            return await inventarioMotorizadoRepo.save(inventarioMotorizado);
        });
    }

    async modificarStock(
        id: string,
        nuevoStock: number
    ): Promise<InventarioMotorizado> {
        return await this.atomicPhase_(async (manager) => {
            const inventarioMotorizadoRepo = manager.withRepository(this.inventarioMotorizadoRepository_);
            const inventarioMotorizado = await this.recuperar(id);

            // Actualizar stock 
            inventarioMotorizado.stock = nuevoStock;

            // Guardar entidad
            return await inventarioMotorizadoRepo.save(inventarioMotorizado);
        });
    }

    

    async aumentarStock(
        id: string,
        cantidad: number
    ): Promise<InventarioMotorizado> {
        return await this.atomicPhase_(async (manager) => {
            const inventarioMotorizadoRepo = manager.withRepository(this.inventarioMotorizadoRepository_);
            const inventarioMotorizado = await this.recuperar(id);

            // Incrementar stock en cantidad
            inventarioMotorizado.stock += cantidad;

            // Guardar entidad actualizada
            return await inventarioMotorizadoRepo.save(inventarioMotorizado);
        });
    }

    async disminuirStock(
        id: string,
        cantidad: number
    ): Promise<InventarioMotorizado> {
        return await this.atomicPhase_(async (manager) => {
            const inventarioMotorizadoRepo = manager.withRepository(this.inventarioMotorizadoRepository_);
            const inventarioMotorizado = await this.recuperar(id);

            // Disminuir stock en cantidad
            inventarioMotorizado.stock -= cantidad;

            // Guardar entidad actualizada
            return await inventarioMotorizadoRepo.save(inventarioMotorizado);
        });
    }

    async findByMotorizadoId(motorizadoId: string): Promise<InventarioMotorizado[]> {
        const inventarioMotorizadoRepo = this.activeManager_.withRepository(this.inventarioMotorizadoRepository_);
        const inventarioMotorizado = await inventarioMotorizadoRepo.findByMotorizadoId(motorizadoId);
        if (!inventarioMotorizado) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Inventario Motorizado no encontrado");
        }
        return inventarioMotorizado;
    }

    async findByCiudadId(ciudadId: string): Promise<InventarioMotorizado[]> {
        const inventarioMotorizadoRepo = this.activeManager_.withRepository(this.inventarioMotorizadoRepository_);
        const motorizadoRepo = this.activeManager_.withRepository(this.motorizadoRepository_);
        const motorizados = await motorizadoRepo.listarPorCiudad(ciudadId);
        console.log("find by ciudad id");
        if (!motorizados) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Motorizados no encontrados");
        }
        console.log("encontre motorizados");
        console.log(motorizados);
        //iterate over motorizados and get the inventarioMotorizado for each one
        let inventarioMotorizados = [];
        for (const motorizado of motorizados) {
            console.log("itreacion motorizado")
            const inventarioMotorizado = await inventarioMotorizadoRepo.findByMotorizadoId(motorizado.id);
            if (inventarioMotorizado) {
                //add the array of inventarioMotorizado to the inventarioMotorizados array
                inventarioMotorizados.push(inventarioMotorizado);
                //log
                console.log(inventarioMotorizados);
            }
        }
        if (!inventarioMotorizados) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, "Inventario Motorizado no encontrado");
        }
        return inventarioMotorizados;
    }


}

export default InventarioMotorizadoService;
