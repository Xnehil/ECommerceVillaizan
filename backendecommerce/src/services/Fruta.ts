import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Fruta } from "../models/Fruta";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import FrutaRepository from "src/repositories/Fruta";

class FrutaService extends TransactionBaseService {
    protected frutaRepository_: typeof FrutaRepository;

    constructor(container){
        super(container);
        this.frutaRepository_ = container.frutaRepository;
    }


    getMessage() {
        return "Hello from FrutaService";
      }

      async listar(): Promise<Fruta[]> {
        const frutaRepo = this.activeManager_.withRepository(this.frutaRepository_);
        return frutaRepo.find();
      }
    
      async listarYContar(
        selector: Selector<Fruta> ={},
        config: FindConfig<Fruta> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<[Fruta[], number]> {
        const frutaRepo = this.activeManager_.withRepository(this.frutaRepository_);
        const query = buildQuery(selector, config);
        return frutaRepo.findAndCount(query);
      }
    
      async listarConPaginacion(
        selector?: Selector<Fruta>,
        config: FindConfig<Fruta> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<Fruta[]> {
        const [frutas] = await this.listarYContar(selector, config);
        return frutas;
      }
    
      async recuperar(
        id: string,
        config?: FindConfig<Fruta>
      ): Promise<Fruta> {
        const frutaRepo = this.activeManager_.withRepository(this.frutaRepository_);
        const query = buildQuery({ id }, config);
        const fruta = await frutaRepo.findOne(query);
    
        if (!fruta) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "Fruta no encontrado");
        }
    
        return fruta;
      }
    
      async crear(fruta: Fruta): Promise<Fruta> {
        return this.atomicPhase_(async (manager) => {
          const frutaRepo = manager.withRepository(this.frutaRepository_);
          const frutaCreado = frutaRepo.create(fruta);
          const result = await frutaRepo.save(frutaCreado);
          return result;
        });
      }
    
      async actualizar(
        id: string,
        data: Omit<Partial<Fruta>, "id">
      ): Promise<Fruta> {
        return await this.atomicPhase_(async (manager) => {
          const frutaRepo = manager.withRepository(this.frutaRepository_);
          const fruta = await this.recuperar(id);
          Object.assign(fruta, data);
          return await frutaRepo.save(fruta);
        });
      }
    
      async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
          const frutaRepo = manager.withRepository(this.frutaRepository_);
          const fruta = await this.recuperar(id);
          await frutaRepo.update(id, { desactivadoEn: new Date() , estaActivo: false})
        });
      }
}

export default FrutaService;