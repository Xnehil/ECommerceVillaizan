import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { ContenidoEducativo } from "../models/ContenidoEducativo";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import ContenidoEducativoRepository from "src/repositories/ContenidoEducativo";

class ContenidoEducativoService extends TransactionBaseService {
    protected contenidoEducativoRepository_: typeof ContenidoEducativoRepository;

    constructor(container){
        super(container);
        this.contenidoEducativoRepository_ = container.contenidoeducativoRepository;
    }


    getMessage() {
        return "Hello from ContenidoEducativoService";
      }

      async listar(): Promise<ContenidoEducativo[]> {
        const contenidoEducativoRepo = this.activeManager_.withRepository(this.contenidoEducativoRepository_);
        return contenidoEducativoRepo.find();
      }
    
      async listarYContar(
        selector: Selector<ContenidoEducativo> ={},
        config: FindConfig<ContenidoEducativo> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<[ContenidoEducativo[], number]> {
        const contenidoEducativoRepo = this.activeManager_.withRepository(this.contenidoEducativoRepository_);
        const query = buildQuery(selector, config);
        return contenidoEducativoRepo.findAndCount(query);
      }
    
      async listarConPaginacion(
        selector?: Selector<ContenidoEducativo>,
        config: FindConfig<ContenidoEducativo> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<ContenidoEducativo[]> {
        const [contenidoEducativos] = await this.listarYContar(selector, config);
        return contenidoEducativos;
      }
    
      async recuperar(
        id: string,
        config?: FindConfig<ContenidoEducativo>
      ): Promise<ContenidoEducativo> {
        const contenidoEducativoRepo = this.activeManager_.withRepository(this.contenidoEducativoRepository_);
        const query = buildQuery({ id }, config);
        const contenidoEducativo = await contenidoEducativoRepo.findOne(query);
    
        if (!contenidoEducativo) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "ContenidoEducativo no encontrado");
        }
    
        return contenidoEducativo;
      }
    
      async crear(contenidoEducativo: ContenidoEducativo): Promise<ContenidoEducativo> {
        return this.atomicPhase_(async (manager) => {
          const contenidoEducativoRepo = manager.withRepository(this.contenidoEducativoRepository_);
          const contenidoEducativoCreado = contenidoEducativoRepo.create(contenidoEducativo);
          const result = await contenidoEducativoRepo.save(contenidoEducativoCreado);
          return result;
        });
      }
    
      async actualizar(
        id: string,
        data: Omit<Partial<ContenidoEducativo>, "id">
      ): Promise<ContenidoEducativo> {
        return await this.atomicPhase_(async (manager) => {
          const contenidoEducativoRepo = manager.withRepository(this.contenidoEducativoRepository_);
          const contenidoEducativo = await this.recuperar(id);
          Object.assign(contenidoEducativo, data);
          return await contenidoEducativoRepo.save(contenidoEducativo);
        });
      }
    
      async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
          const contenidoEducativoRepo = manager.withRepository(this.contenidoEducativoRepository_);
          const contenidoEducativo = await this.recuperar(id);
          await contenidoEducativoRepo.remove([contenidoEducativo]);
        });
      }
}

export default ContenidoEducativoService;