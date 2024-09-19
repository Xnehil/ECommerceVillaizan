import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Producto } from "../models/Producto";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import ProductoRepository from "src/repositories/Producto";

class ProductoService extends TransactionBaseService {
    protected productoRepository_: typeof ProductoRepository;

    constructor(container){
        super(container);
        this.productoRepository_ = container.productoRepository;
    }


    getMessage() {
        return "Hello from ProductoService";
      }

      async listar(): Promise<Producto[]> {
        const productoRepo = this.activeManager_.withRepository(this.productoRepository_);
        return productoRepo.find();
      }
    
      async listarYContar(
        selector: Selector<Producto> ={},
        config: FindConfig<Producto> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<[Producto[], number]> {
        const productoRepo = this.activeManager_.withRepository(this.productoRepository_);
        const query = buildQuery(selector, config);
        return productoRepo.findAndCount(query);
      }
    
      async listarConPaginacion(
        selector?: Selector<Producto>,
        config: FindConfig<Producto> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<Producto[]> {
        const [productos] = await this.listarYContar(selector, config);
        return productos;
      }
    
      async recuperar(
        id: string,
        config?: FindConfig<Producto>
      ): Promise<Producto> {
        const productoRepo = this.activeManager_.withRepository(this.productoRepository_);
        const query = buildQuery({ id }, config);
        const producto = await productoRepo.findOne(query);
    
        if (!producto) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "Producto no encontrado");
        }
    
        return producto;
      }
    
      async crear(producto: Producto): Promise<Producto> {
        return this.atomicPhase_(async (manager) => {
          const productoRepo = manager.withRepository(this.productoRepository_);
          const productoCreado = productoRepo.create(producto);
          const result = await productoRepo.save(productoCreado);
          return result;
        });
      }
    
      async actualizar(
        id: string,
        data: Omit<Partial<Producto>, "id">
      ): Promise<Producto> {
        return await this.atomicPhase_(async (manager) => {
          const productoRepo = manager.withRepository(this.productoRepository_);
          const producto = await this.recuperar(id);
          Object.assign(producto, data);
          return await productoRepo.save(producto);
        });
      }
    
      async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
          const productoRepo = manager.withRepository(this.productoRepository_);
          const producto = await this.recuperar(id);
          await productoRepo.remove([producto]);
        });
      }
}

export default ProductoService;