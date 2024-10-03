import { Motorizado } from "../models/Motorizado"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const MotorizadoRepository = dataSource
  .getRepository(Motorizado)
  .extend({
    async findByUsuarioId(id_usuario: string): Promise<Motorizado | undefined> {
      return this.createQueryBuilder("motorizado")
        .leftJoinAndSelect("motorizado.usuario", "usuario")
        .where("usuario.id = :id_usuario", { id_usuario })
        .getOne();
    }
  })

export default MotorizadoRepository
