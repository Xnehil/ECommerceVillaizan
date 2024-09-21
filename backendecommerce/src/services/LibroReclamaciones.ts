import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { LibroReclamaciones } from "../models/LibroReclamaciones";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import LibroReclamacionesRepository from "src/repositories/LibroReclamaciones";

class LibroReclamacionesService extends TransactionBaseService {
    protected libroReclamacionesRepository_: typeof LibroReclamacionesRepository;

    constructor(container){
        super(container);
        this.libroReclamacionesRepository_ = container.libroReclamacionesRepository;
    }


    getMessage() {
        return "Hello from LibroReclamacionesService";
      }

      async listar(): Promise<LibroReclamaciones[]> {
        const LibroReclamacionesRepo = this.activeManager_.withRepository(this.libroReclamacionesRepository_);
        return LibroReclamacionesRepo.find();
      }
    
      async listarYContar(
        selector: Selector<LibroReclamaciones> ={},
        config: FindConfig<LibroReclamaciones> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<[LibroReclamaciones[], number]> {
        const LibroReclamacionesRepo = this.activeManager_.withRepository(this.libroReclamacionesRepository_);
        const query = buildQuery(selector, config);
        return LibroReclamacionesRepo.findAndCount(query);
      }
    
      async listarConPaginacion(
        selector?: Selector<LibroReclamaciones>,
        config: FindConfig<LibroReclamaciones> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<LibroReclamaciones[]> {
        const [LibroReclamacioness] = await this.listarYContar(selector, config);
        return LibroReclamacioness;
      }
    
      async recuperar(
        id: string,
        config?: FindConfig<LibroReclamaciones>
      ): Promise<LibroReclamaciones> {
        const LibroReclamacionesRepo = this.activeManager_.withRepository(this.libroReclamacionesRepository_);
        const query = buildQuery({ id }, config);
        const LibroReclamaciones = await LibroReclamacionesRepo.findOne(query);
    
        if (!LibroReclamaciones) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "LibroReclamaciones no encontrado");
        }
    
        return LibroReclamaciones;
      }
    
      async crear(libroReclamaciones: LibroReclamaciones): Promise<LibroReclamaciones> {
        return this.atomicPhase_(async (manager) => {
          const libroReclamacionesRepo = manager.withRepository(this.libroReclamacionesRepository_);
          const libroReclamacionesCreado = libroReclamacionesRepo.create(libroReclamaciones);
          const result = await libroReclamacionesRepo.save(libroReclamacionesCreado);
          return result;
        });
      }
    
      async actualizar(
        id: string,
        data: Omit<Partial<LibroReclamaciones>, "id">
      ): Promise<LibroReclamaciones> {
        return await this.atomicPhase_(async (manager) => {
          const LibroReclamacionesRepo = manager.withRepository(this.libroReclamacionesRepository_);
          const LibroReclamaciones = await this.recuperar(id);
          Object.assign(LibroReclamaciones, data);
          return await LibroReclamacionesRepo.save(LibroReclamaciones);
        });
      }
    
      async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
          const libroReclamacionesRepo = manager.withRepository(this.libroReclamacionesRepository_);
          const libroReclamaciones = await this.recuperar(id);
          await libroReclamacionesRepo.remove([libroReclamaciones]);
        });
      }
}

export default LibroReclamacionesService;