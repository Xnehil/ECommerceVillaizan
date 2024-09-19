import { Producto } from "../models/Producto"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const ProductoRepository = dataSource
  .getRepository(Producto)
  .extend({
  })

export default ProductoRepository