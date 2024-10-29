import { Rol } from "../models/Rol"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const RolRepository = dataSource
  .getRepository(Rol) 
  .extend({
    async findByNombre(nombre: string): Promise<Rol> {
        return this.find({
          where: {
            nombre: nombre,
          },
        });
    }
  })

export default RolRepository