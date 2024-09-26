import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { InventarioAlmacen } from "../models/InventarioAlmacen";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import InventarioAlmacenRepository from "src/repositories/InventarioAlmacen";

class InventarioAlmacenService extends TransactionBaseService {
    protected inventarioAlmacenRepository_: typeof InventarioAlmacenRepository;

    constructor(container){
        super(container);
        this.inventarioAlmacenRepository_ = container.inventarioalmacenRepository;
    }


    getMessage() {
        return "Hello from InventarioAlmacenService";
      }

      async listar(): Promise<InventarioAlmacen[]> {
        const inventarioAlmacenRepo = this.activeManager_.withRepository(this.inventarioAlmacenRepository_);
        return inventarioAlmacenRepo.find();
      }
    
      async listarYContar(
        selector: Selector<InventarioAlmacen> ={},
        config: FindConfig<InventarioAlmacen> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<[InventarioAlmacen[], number]> {
        const inventarioAlmacenRepo = this.activeManager_.withRepository(this.inventarioAlmacenRepository_);
        const query = buildQuery(selector, config);
        return inventarioAlmacenRepo.findAndCount(query);
      }
    
      async listarConPaginacion(
        selector?: Selector<InventarioAlmacen>,
        config: FindConfig<InventarioAlmacen> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<InventarioAlmacen[]> {
        const [inventarioAlmacens] = await this.listarYContar(selector, config);
        return inventarioAlmacens;
      }
    
      async recuperar(
        id: string,
        config?: FindConfig<InventarioAlmacen>
      ): Promise<InventarioAlmacen> {
        const inventarioAlmacenRepo = this.activeManager_.withRepository(this.inventarioAlmacenRepository_);
        const query = buildQuery({ id }, config);
        const inventarioAlmacen = await inventarioAlmacenRepo.findOne(query);
    
        if (!inventarioAlmacen) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "InventarioAlmacen no encontrado");
        }
    
        return inventarioAlmacen;
      }
    
      async crear(inventarioAlmacen: InventarioAlmacen): Promise<InventarioAlmacen> {
        return this.atomicPhase_(async (manager) => {
          const inventarioAlmacenRepo = manager.withRepository(this.inventarioAlmacenRepository_);
          const inventarioAlmacenCreado = inventarioAlmacenRepo.create(inventarioAlmacen);
          const result = await inventarioAlmacenRepo.save(inventarioAlmacenCreado);
          return result;
        });
      }
    
      async actualizar(
        id: string,
        data: Omit<Partial<InventarioAlmacen>, "id">
      ): Promise<InventarioAlmacen> {
        return await this.atomicPhase_(async (manager) => {
          const inventarioAlmacenRepo = manager.withRepository(this.inventarioAlmacenRepository_);
          const inventarioAlmacen = await this.recuperar(id);
          Object.assign(inventarioAlmacen, data);
          return await inventarioAlmacenRepo.save(inventarioAlmacen);
        });
      }
    
      async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
          const inventarioAlmacenRepo = manager.withRepository(this.inventarioAlmacenRepository_);
          const inventarioAlmacen = await this.recuperar(id);
          await inventarioAlmacenRepo.remove([inventarioAlmacen]);
        });
      }

      async modificarStock(
        id: string,
        nuevoStock: number
    ): Promise<InventarioAlmacen> {
        return await this.atomicPhase_(async (manager) => {
            const inventarioAlmacenRepo = manager.withRepository(this.inventarioAlmacenRepository_);
            const inventarioAlmacen = await this.recuperar(id);

            // Updating stock value
            inventarioAlmacen.stock = nuevoStock;

            // Save updated entity
            return await inventarioAlmacenRepo.save(inventarioAlmacen);
        });
    }

    async aumentarStock(
        id: string,
        cantidad: number
    ): Promise<InventarioAlmacen> {
        return await this.atomicPhase_(async (manager) => {
            const inventarioAlmacenRepo = manager.withRepository(this.inventarioAlmacenRepository_);
            const inventarioAlmacen = await this.recuperar(id);

            // Updating stock value
            inventarioAlmacen.stock += cantidad;

            // Save updated entity
            return await inventarioAlmacenRepo.save(inventarioAlmacen);
        });
    }

    async disminuirStock(
        id: string,
        cantidad: number
    ): Promise<InventarioAlmacen> {
        return await this.atomicPhase_(async (manager) => {
            const inventarioAlmacenRepo = manager.withRepository(this.inventarioAlmacenRepository_);
            const inventarioAlmacen = await this.recuperar(id);

            // Updating stock value
            inventarioAlmacen.stock -= cantidad;

            // Save updated entity
            return await inventarioAlmacenRepo.save(inventarioAlmacen);
        });
    }
}

export default InventarioAlmacenService;