import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Almacen } from "../models/Almacen";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import AlmacenRepository from "src/repositories/Almacen";

class AlmacenService extends TransactionBaseService {
    protected almacenRepository_: typeof AlmacenRepository;

    constructor(container){
        super(container);
        this.almacenRepository_ = container.almacenRepository;
    }


    getMessage() {
        return "Hello from AlmacenService";
      }

      async listar(): Promise<Almacen[]> {
        const almacenRepo = this.activeManager_.withRepository(this.almacenRepository_);
        return almacenRepo.find();
      }
    
      async listarYContar(
        selector: Selector<Almacen> ={},
        config: FindConfig<Almacen> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<[Almacen[], number]> {
        const almacenRepo = this.activeManager_.withRepository(this.almacenRepository_);
        const query = buildQuery(selector, config);
        return almacenRepo.findAndCount(query);
      }
    
      async listarConPaginacion(
        selector?: Selector<Almacen>,
        config: FindConfig<Almacen> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<Almacen[]> {
        const [almacens] = await this.listarYContar(selector, config);
        return almacens;
      }
    
      async recuperar(
        id: string,
        config?: FindConfig<Almacen>
      ): Promise<Almacen> {
        const almacenRepo = this.activeManager_.withRepository(this.almacenRepository_);
        const query = buildQuery({ id }, config);
        const almacen = await almacenRepo.findOne(query);
    
        if (!almacen) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "Almacen no encontrado");
        }
    
        return almacen;
      }
    
      async crear(almacen: Almacen): Promise<Almacen> {
        return this.atomicPhase_(async (manager) => {
          const almacenRepo = manager.withRepository(this.almacenRepository_);
          const almacenCreado = almacenRepo.create(almacen);
          const result = await almacenRepo.save(almacenCreado);
          return result;
        });
      }
    
      async actualizar(
        id: string,
        data: Omit<Partial<Almacen>, "id">
      ): Promise<Almacen> {
        return await this.atomicPhase_(async (manager) => {
          const almacenRepo = manager.withRepository(this.almacenRepository_);
          const almacen = await this.recuperar(id);
          Object.assign(almacen, data);
          return await almacenRepo.save(almacen);
        });
      }
    
      async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
          const almacenRepo = manager.withRepository(this.almacenRepository_);
          const almacen = await this.recuperar(id);
          await almacenRepo.update(id, {estaActivo: false, desactivadoEn: new Date()})
        });
      }
}

export default AlmacenService;