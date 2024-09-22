import { Subcategoria } from "src/models/Subcategoria"
import { Producto } from "../models/Producto"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const SubcategoriaRepository = dataSource
  .getRepository(Subcategoria)
  .extend({
  })

export default SubcategoriaRepository

