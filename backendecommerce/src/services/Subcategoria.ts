import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Subcategoria } from "../models/Subcategoria";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import SubcategoriaRepository from "src/repositories/Subcategoria";

class SubcategoriaService extends TransactionBaseService {
    protected subcategoriaRepository_: typeof SubcategoriaRepository;

    constructor(container){
        super(container);
        this.subcategoriaRepository_ = container.subcategoriaRepository;
    }


    getMessage() {
        return "Hello from SubcategoriaService";
      }

      async listar(): Promise<Subcategoria[]> {
        const subcategoriaRepo = this.activeManager_.withRepository(this.subcategoriaRepository_);
        return subcategoriaRepo.find();
      }
    
      async listarYContar(
        selector: Selector<Subcategoria> ={},
        config: FindConfig<Subcategoria> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<[Subcategoria[], number]> {
        const subcategoriaRepo = this.activeManager_.withRepository(this.subcategoriaRepository_);
        const query = buildQuery(selector, config);
        return subcategoriaRepo.findAndCount(query);
      }
    
      async listarConPaginacion(
        selector?: Selector<Subcategoria>,
        config: FindConfig<Subcategoria> = {
          skip: 0,
          take: 20,
          relations: [],
        }
      ): Promise<Subcategoria[]> {
        const [subcategorias] = await this.listarYContar(selector, config);
        return subcategorias;
      }
    
      async recuperar(
        id: string,
        config?: FindConfig<Subcategoria>
      ): Promise<Subcategoria> {
        const subcategoriaRepo = this.activeManager_.withRepository(this.subcategoriaRepository_);
        const query = buildQuery({ id }, config);
        const subcategoria = await subcategoriaRepo.findOne(query);
    
        if (!subcategoria) {
          throw new MedusaError(MedusaError.Types.NOT_FOUND, "Subcategoria no encontrado");
        }
    
        return subcategoria;
      }
    
      async crear(subcategoria: Subcategoria): Promise<{ subcategoria: Subcategoria, alreadyExists: boolean }> {
        return this.atomicPhase_(async (manager) => {
          const subcategoriaRepo = manager.withRepository(this.subcategoriaRepository_);

          // Check if a tipoProducto with the same nombre (lowercased) already exists
          const existingSubcategoria = await subcategoriaRepo.createQueryBuilder('subcategoria')
          .where('LOWER(subcategoria.nombre) = LOWER(:nombre)', { nombre: subcategoria.nombre })
          .getOne();

      
          if (existingSubcategoria) {
            return {subcategoria: existingSubcategoria, alreadyExists: true};
          }
      
          const subcategoriaCreada = subcategoriaRepo.create(subcategoria);
          const result = await subcategoriaRepo.save(subcategoriaCreada);
          return {subcategoria: result, alreadyExists: false};
        });
      }
    
      async actualizar(
        id: string,
        data: Omit<Partial<Subcategoria>, "id">
      ): Promise<Subcategoria> {
        return await this.atomicPhase_(async (manager) => {
          const subcategoriaRepo = manager.withRepository(this.subcategoriaRepository_);
          const subcategoria = await this.recuperar(id);

          if (data.nombre) {
            const existingSubcategoria = await subcategoriaRepo.createQueryBuilder('subcategoria')
            .where('LOWER(subcategoria.nombre) = LOWER(:nombre)', { nombre: data.nombre })
            .getOne();
            if (existingSubcategoria && existingSubcategoria.id !== id) {
              throw new Error(`Subcategoria con nombre "${data.nombre}" ya existe.`);
            }
          }

          Object.assign(subcategoria, data);
          return await subcategoriaRepo.save(subcategoria);
        });
      }
    
      async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
            const subcategoriaRepo = manager.withRepository(this.subcategoriaRepository_);
            const productos = await manager.query(
              'SELECT * FROM vi_producto_subcategoria WHERE id_subcategoria = $1',
              [id]
          );

            if (productos.length > 0) {
                throw new MedusaError(MedusaError.Types.NOT_ALLOWED, "productos asociados");
            }
    
            const subcategoria = await this.recuperar(id);
            await subcategoriaRepo.update(id, { estaActivo: true, desactivadoEn: new Date() });
        });
    }
}

export default SubcategoriaService;