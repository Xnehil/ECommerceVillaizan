import { Fruta } from "../models/Fruta"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const FrutaRepository = dataSource
  .getRepository(Fruta)
  .extend({
  })

export default FrutaRepository