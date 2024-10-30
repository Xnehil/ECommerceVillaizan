import { Usuario } from "../models/Usuario"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const UsuarioRepository = dataSource
  .getRepository(Usuario) 
  .extend({
    async findByEmail(correo: string): Promise<Usuario> {
        return this.findOne({
          where: {
            correo: correo,
          },
          relations: ['persona', 'rol'],
          
        });
    },
    async findById(id: string): Promise<Usuario> {
        return this.findOne({
          where: {
            id: id,
          },
          relations: ['persona', 'rol'],
          
        });
    }
  })

export default UsuarioRepository
