import { InventarioAlmacen } from "../models/InventarioAlmacen"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const InventarioAlmacenRepository = dataSource
  .getRepository(InventarioAlmacen)
  .extend({
  })

export default InventarioAlmacenRepository
