import { Producto } from "../models/Producto"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const ProductoRepository = dataSource
  .getRepository(Producto)
  .extend({
    async findProductosWithInventariosByCiudad(ciudadId: string): Promise<Producto[]> {
      return await this.createQueryBuilder("producto")
        .leftJoinAndSelect("producto.inventarios", "inventario")
        .leftJoinAndSelect("inventario.motorizado", "motorizado")
        .leftJoinAndSelect("producto.tipoProducto", "tipoProducto") // Joining TipoProducto
        .leftJoinAndSelect("producto.subcategorias", "subcategoria") // Joining Subcategoria
        .leftJoinAndSelect("producto.frutas", "fruta") // Joining Fruta
        .where("motorizado.id_ciudad = :ciudadId", { ciudadId })
        .andWhere("producto.seVendeEcommerce = :seVendeEcommerce", { seVendeEcommerce: true })
        .getMany();
    }
  })

export default ProductoRepository
