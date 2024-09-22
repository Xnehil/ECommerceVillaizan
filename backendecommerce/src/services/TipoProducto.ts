import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { TipoProducto } from "../models/TipoProducto";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import TipoProductoRepository from "src/repositories/TipoProducto";

class TipoProductoService extends TransactionBaseService {
    protected tipoProductoRepository_: typeof TipoProductoRepository;

    constructor(container){
        super(container);
        this.tipoProductoRepository_ = container.tipoproductoRepository;
    }


    getMessage() {
        return "Hello from TipoProductoService";
      }

      async listar(): Promise<TipoProducto[]> {
        const tipoProductoRepo = this.activeManager_.withRepository(this.tipoProductoRepository_);
        return tipoProductoRepo.find();
      }
    
      async listarYContar(
        selector: Selector<TipoProducto> ={},
        config: FindConfig<TipoProducto> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<[TipoProducto[], number]> {
        const tipoProductoRepo = this.activeManager_.withRepository(this.tipoProductoRepository_);
        const query = buildQuery(selector, config);
        return tipoProductoRepo.findAndCount(query);
      }
    
      async listarConPaginacion(
        selector?: Selector<TipoProducto>,
        config: FindConfig<TipoProducto> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<TipoProducto[]> {
        const [tipoProductos] = await this.listarYContar(selector, config);
        return tipoProductos;
      }
    
      async recuperar(
        id: string,
        config?: FindConfig<TipoProducto>
      ): Promise<TipoProducto> {
        const tipoProductoRepo = this.activeManager_.withRepository(this.tipoProductoRepository_);
        const query = buildQuery({ id }, config);
        const tipoProducto = await tipoProductoRepo.findOne(query);
    
        if (!tipoProducto) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "TipoProducto no encontrado");
        }
    
        return tipoProducto;
      }
    
      async crear(tipoProducto: TipoProducto): Promise<TipoProducto> {
        return this.atomicPhase_(async (manager) => {
          const tipoProductoRepo = manager.withRepository(this.tipoProductoRepository_);
          const tipoProductoCreado = tipoProductoRepo.create(tipoProducto);
          const result = await tipoProductoRepo.save(tipoProductoCreado);
          return result;
        });
      }
    
      async actualizar(
        id: string,
        data: Omit<Partial<TipoProducto>, "id">
      ): Promise<TipoProducto> {
        return await this.atomicPhase_(async (manager) => {
          const tipoProductoRepo = manager.withRepository(this.tipoProductoRepository_);
          const tipoProducto = await this.recuperar(id);
          Object.assign(tipoProducto, data);
          return await tipoProductoRepo.save(tipoProducto);
        });
      }
    
      async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
          const tipoProductoRepo = manager.withRepository(this.tipoProductoRepository_);
          const tipoProducto = await this.recuperar(id);
          await tipoProductoRepo.remove([tipoProducto]);
        });
      }
}

export default TipoProductoService;