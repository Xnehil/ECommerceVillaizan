import { TipoProducto } from "src/models/TipoProducto"
import { Producto } from "../models/Producto"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const TipoProductoRepository = dataSource
  .getRepository(TipoProducto)
  .extend({
  })

export default TipoProductoRepository