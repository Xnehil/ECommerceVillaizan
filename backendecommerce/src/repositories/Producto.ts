import { Producto } from "../models/Producto"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const ProductoRepository = dataSource
  .getRepository(Producto)
  .extend({
    async findProductosWithInventariosByCiudad(ciudadId: string): Promise<Producto[]> {
      return await this.createQueryBuilder("producto")
        .leftJoinAndSelect("producto.inventarios", "inventario")
        .leftJoinAndSelect("inventario.motorizado", "motorizado")
        .where("motorizado.id_ciudad = :ciudadId", { ciudadId })
        .getMany();
    }
  })

export default ProductoRepository