import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Ajuste } from "../models/Ajuste";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import AjusteRepository from "@repositories/Ajuste";

class AjusteService extends TransactionBaseService {
    protected ajusteRepository_: typeof AjusteRepository;

    constructor(container){
        super(container);
        this.ajusteRepository_ = container.ajusteRepository;
    }


    getMessage() {
        return "Hello from AjusteService";
      }

      async listar(): Promise<Ajuste[]> {
        const ajusteRepo = this.activeManager_.withRepository(this.ajusteRepository_);
        return ajusteRepo.find();
      }
    
      async listarYContar(
        selector: Selector<Ajuste> ={},
        config: FindConfig<Ajuste> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<[Ajuste[], number]> {
        const ajusteRepo = this.activeManager_.withRepository(this.ajusteRepository_);
        const query = buildQuery(selector, config);
        return ajusteRepo.findAndCount(query);
      }
    
      async listarConPaginacion(
        selector?: Selector<Ajuste>,
        config: FindConfig<Ajuste> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<Ajuste[]> {
        const [ajustes] = await this.listarYContar(selector, config);
        return ajustes;
      }
    
      async recuperar(
        llave: string,
        config?: FindConfig<Ajuste>
      ): Promise<Ajuste> {
        const ajusteRepo = this.activeManager_.withRepository(this.ajusteRepository_);
        const query = buildQuery({ llave }, config);
        const ajuste = await ajusteRepo.findOne(query);
    
        if (!ajuste) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "Ajuste no encontrado");
        }
    
        return ajuste;
      }
    
      async crear(ajuste: Ajuste): Promise<Ajuste> {
        return this.atomicPhase_(async (manager) => {
          const ajusteRepo = manager.withRepository(this.ajusteRepository_);
          const ajusteCreado = ajusteRepo.create(ajuste);
          const result = await ajusteRepo.save(ajusteCreado);
          return result;
        });
      }
    
      async actualizar(
        llave: string,
        data: Omit<Partial<Ajuste>, "llave">
      ): Promise<Ajuste> {
        return await this.atomicPhase_(async (manager) => {
          const ajusteRepo = manager.withRepository(this.ajusteRepository_);
          const ajuste = await this.recuperar(llave);
          Object.assign(ajuste, data);
          return await ajusteRepo.save(ajuste);
        });
      }
    
      async eliminar(llave: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
          const ajusteRepo = manager.withRepository(this.ajusteRepository_);
          const ajuste = await this.recuperar(llave);
          await ajusteRepo.update(llave, {estaActivo: false, desactivadoEn: new Date()})
        });
      }
}

export default AjusteService;