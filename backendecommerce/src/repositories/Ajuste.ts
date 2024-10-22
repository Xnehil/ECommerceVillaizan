import { Ajuste } from "../models/Ajuste"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const AjusteRepository = dataSource
  .getRepository(Ajuste)
  .extend({
  })

export default AjusteRepository