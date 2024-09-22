import { Almacen } from "../models/Almacen"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const AlmacenRepository = dataSource
  .getRepository(Almacen)
  .extend({
  })

export default AlmacenRepository