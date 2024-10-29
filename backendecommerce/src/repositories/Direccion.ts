import { Direccion } from "../models/Direccion"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const DireccionRepository = dataSource
  .getRepository(Direccion)
  .extend({
    async findByUsuarioIdGuardados(idUsuario: string) {
      return this.find({
        where: {
          usuario: {
            id: idUsuario,
          },
          guardada: true,
        }
      });
      
    },
    async findByUsuarioId(idUsuario: string) {
      return this.find({
        where: {
          usuario: {
            id: idUsuario,
          },
        }
      });
    }
  })

export default DireccionRepository
