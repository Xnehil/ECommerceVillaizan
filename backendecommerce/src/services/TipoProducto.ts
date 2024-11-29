import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { TipoProducto } from "../models/TipoProducto";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import TipoProductoRepository from "src/repositories/TipoProducto";
import { Producto } from "@models/Producto";

class TipoProductoService extends TransactionBaseService {
    protected tipoProductoRepository_: typeof TipoProductoRepository;

    constructor(container){
        super(container);
        this.tipoProductoRepository_ = container.tipoproductoRepository;
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
    
      async crear(tipoProducto: TipoProducto): Promise<{ tipoProducto: TipoProducto, alreadyExists: boolean }> {
        return this.atomicPhase_(async (manager) => {
            const tipoProductoRepo = manager.withRepository(this.tipoProductoRepository_);
    
            // Check if a tipoProducto with the same nombre (lowercased) already exists
            const existingTipoProducto = await tipoProductoRepo.createQueryBuilder('tipoProducto')
                .where('LOWER(tipoProducto.nombre) = LOWER(:nombre)', { nombre: tipoProducto.nombre })
                .getOne();
    
            if (existingTipoProducto) {
                return { tipoProducto: existingTipoProducto, alreadyExists: true };
            }
    
            const tipoProductoCreado = tipoProductoRepo.create(tipoProducto);
            const result = await tipoProductoRepo.save(tipoProductoCreado);
            return { tipoProducto: result, alreadyExists: false };
        });
    }
    
      async actualizar(
        id: string,
        data: Omit<Partial<TipoProducto>, "id">
      ): Promise<TipoProducto> {
        return await this.atomicPhase_(async (manager) => {
          const tipoProductoRepo = manager.withRepository(this.tipoProductoRepository_);
          const tipoProducto = await this.recuperar(id);

          if(data.nombre){
            const existingTipoProducto = await tipoProductoRepo.createQueryBuilder('tipoProducto')
            .where('LOWER(tipoProducto.nombre) = LOWER(:nombre)', { nombre: data.nombre })
            .getOne();
            if (existingTipoProducto && existingTipoProducto.id !== id) {
              throw new Error(`Tipo de producto con nombre "${data.nombre}" ya existe.`);
          }
        }

          Object.assign(tipoProducto, data);
          return await tipoProductoRepo.save(tipoProducto);
        });
      }
    
      async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            console.log("Eliminando tipo de producto con id: ", id);
            const tipoProductoRepo = manager.withRepository(this.tipoProductoRepository_);
            const productos = await manager.query(
              'SELECT * FROM vi_producto WHERE id_tipoproducto = $1',
              [id]
          );
            if (productos.length > 0) {
                throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "No se puede eliminar este tipo de producto porque tiene productos asociados");
            }
    
            const tipoProducto = await this.recuperar(id);
            await tipoProductoRepo.update(id, { estaActivo: false , desactivadoEn: new Date() });
        });
    }
}

export default TipoProductoService;