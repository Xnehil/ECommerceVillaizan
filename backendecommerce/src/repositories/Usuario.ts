import { Usuario } from "../models/Usuario"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const UsuarioRepository = dataSource
  .getRepository(Usuario) 
  .extend({
  })

export default UsuarioRepository
