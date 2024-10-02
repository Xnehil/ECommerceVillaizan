import { ContenidoEducativo } from "../models/ContenidoEducativo"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const ContenidoEducativoRepository = dataSource
  .getRepository(ContenidoEducativo)
  .extend({
  })

export default ContenidoEducativoRepository
