import { LibroReclamaciones } from "../models/LibroReclamaciones"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const LibroReclamacionesRepository = dataSource
  .getRepository(LibroReclamaciones)
  .extend({
  })

export default LibroReclamacionesRepository