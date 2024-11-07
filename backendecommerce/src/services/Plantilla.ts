import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Plantilla } from "../models/Plantilla";
import { Repository } from "typeorm";
import { MedusaError } from "@medusajs/utils"
import PlantillaRepository from "@repositories/Plantilla";
import ProductoRepository from "@repositories/Producto";
import PlantillaProductoRepository from "@repositories/PlantillaProducto";
import { PlantillaProducto } from "../models/PlantillaProducto";

class PlantillaService extends TransactionBaseService {
    protected plantillaRepository_: typeof PlantillaRepository;
    protected productoRepository_: typeof ProductoRepository;
    protected plantillaProductoRepository_: typeof PlantillaProductoRepository;

    constructor(container){
        super(container);
        this.plantillaRepository_ = container.plantillaRepository;
        this.productoRepository_ = container.productoRepository;
        this.plantillaProductoRepository_ = container.plantillaproductoRepository;
    }


    getMessage() {
        return "Hello from PlantillaService";
      }

      async listar(): Promise<Plantilla[]> {
        const plantillaRepo = this.activeManager_.withRepository(this.plantillaRepository_);
        return plantillaRepo.find();
      }
    
      async listarYContar(
        selector: Selector<Plantilla> ={},
        config: FindConfig<Plantilla>
      ): Promise<[Plantilla[], number]> {
        const plantillaRepo = this.activeManager_.withRepository(this.plantillaRepository_);
        const query = buildQuery(selector, config);
        return plantillaRepo.findAndCount(query);
      }
    
      async listarConPaginacion(
        where: any,
        options: { skip: number; take: number; relations: string[] }
      ): Promise<Plantilla[]> {
        const plantillaRepo = this.activeManager_.withRepository(this.plantillaRepository_);
    
        const queryBuilder = plantillaRepo.createQueryBuilder("plantilla")
          .where(where)
          .skip(options.skip)
          .take(options.take);
    
        if (options.relations.includes("productos")) {
          queryBuilder.leftJoinAndSelect("plantilla.productos", "plantillaProducto", "plantillaProducto.estaActivo = :estaActivo", { estaActivo: true });
        }
    
        if (options.relations.includes("productos.producto")) {
          queryBuilder.leftJoinAndSelect("plantillaProducto.producto", "producto");
        }
    
        return await queryBuilder.getMany();
    }
    
    
    async recuperar(
      id: string,
      config?: FindConfig<Plantilla>
    ): Promise<Plantilla> {
      const plantillaRepo = this.activeManager_.withRepository(this.plantillaRepository_);
  
      const queryBuilder = plantillaRepo.createQueryBuilder("plantilla")
        .leftJoinAndSelect("plantilla.productos", "plantillaProducto", "plantillaProducto.estaActivo = :estaActivo", { estaActivo: true })
        .leftJoinAndSelect("plantillaProducto.producto", "producto")
        .where("plantilla.id = :id", { id });
  
      const plantilla = await queryBuilder.getOne();
  
      if (!plantilla) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "Plantilla no encontrado");
      }
  
      return plantilla;
    }
    
      async crear(plantilla: Plantilla): Promise<Plantilla> {
        return this.atomicPhase_(async (manager) => {
          const plantillaRepo = manager.withRepository(this.plantillaRepository_);
          const productoRepo = manager.withRepository(this.productoRepository_);
          const plantillaProductoRepo = manager.withRepository(this.plantillaProductoRepository_);
      
          // Create the Plantilla entity
          const plantillaCreado = plantillaRepo.create(plantilla);
          const savedPlantilla = await plantillaRepo.save(plantillaCreado);
      
          // Create and save PlantillaProducto entities
          if (plantilla.productos && plantilla.productos.length > 0) {
            for (const productoData of plantilla.productos) {
                const producto = await productoRepo.findOne({ where: { id: productoData.producto.id } });
              if (producto) {
                const plantillaProducto = new PlantillaProducto();
                plantillaProducto.plantilla = savedPlantilla;
                plantillaProducto.producto = producto;
                plantillaProducto.cantidad = productoData.cantidad;
                await plantillaProductoRepo.save(plantillaProducto);
              }
            }
          }
      
          return savedPlantilla;
        });
      }
    
      async actualizar(
        id: string,
        data: Omit<Partial<Plantilla>, "id">
      ): Promise<Plantilla> {
        return await this.atomicPhase_(async (manager) => {
          const plantillaRepo = manager.withRepository(this.plantillaRepository_);
          const plantillaProductoRepo = manager.withRepository(this.plantillaProductoRepository_);
          const plantilla = await this.recuperar(id);
          Object.assign(plantilla, data);
      
          // Get the existing PlantillaProducto entities
          const existingPlantillaProductos = await plantillaProductoRepo.find({
            where: { plantilla: { id } },
            relations: ["producto"]
          });
      
          // Update or create PlantillaProducto entities
          const updatedProductos = data.productos || [];
          console.log("Todo bien hasta antes de guardar los productos");
          for (const productoData of updatedProductos) {
            let plantillaProducto = existingPlantillaProductos.find(pp => pp.producto.id === productoData.producto.id);
            if (plantillaProducto) {
              // Update existing PlantillaProducto
              plantillaProducto.cantidad = productoData.cantidad;
              plantillaProducto.plantilla = plantilla;
              plantillaProducto.estaActivo = true;
            } else {
              // Create new PlantillaProducto
              const producto = await manager.withRepository(this.productoRepository_).findOne({ where: { id: productoData.producto.id } });
              if (producto) {
                plantillaProducto = new PlantillaProducto();
                plantillaProducto.plantilla = plantilla;
                plantillaProducto.producto = producto;
                plantillaProducto.cantidad = productoData.cantidad;
                plantillaProducto.estaActivo = true;
                existingPlantillaProductos.push(plantillaProducto);
              }
            }
            // console.log("plantillaProducto", plantillaProducto);
            await plantillaProductoRepo.save(plantillaProducto);
          }
          console.log("Todo bien hasta guardar los productos");
          for (const existingPlantillaProducto of existingPlantillaProductos) {
            const found = updatedProductos.find(p => p.producto.id === existingPlantillaProducto.producto.id);
            console.log("Checking if producto exists in updatedProductos:", {
              existingProductoId: existingPlantillaProducto.producto.id,
              found
            });
            if (!found) {
              existingPlantillaProducto.estaActivo = false;
              console.log("existingPlantillaProducto to be deactivated:", existingPlantillaProducto);
              await plantillaProductoRepo.save(existingPlantillaProducto);
            }
          }
          console.log("Todo bien hasta eliminar los productos");
      
          return plantilla;
        });
      }
    
      async eliminar(id: string): Promise<void> {
        return await this.atomicPhase_(async (manager) => {
          const plantillaRepo = manager.withRepository(this.plantillaRepository_);
          const plantilla = await this.recuperar(id);
          for (const producto of plantilla.productos) {
            producto.estaActivo = false;
            await manager.withRepository(this.plantillaProductoRepository_).save(producto);
          }
          await plantillaRepo.update(id, { desactivadoEn: new Date() , estaActivo: false})
        });
      }
}

export default PlantillaService;