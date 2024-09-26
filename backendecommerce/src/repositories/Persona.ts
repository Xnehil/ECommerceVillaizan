import { Persona } from "../models/Persona"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const PersonaRepository = dataSource
  .getRepository(Persona) 
  .extend({
  })

export default PersonaRepository