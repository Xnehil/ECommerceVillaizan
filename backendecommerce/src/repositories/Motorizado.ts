import { Motorizado } from "../models/Motorizado"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const MotorizadoRepository = dataSource
  .getRepository(Motorizado)
  .extend({
    async encontrarPorUsuarioId(id_usuario: string): Promise<Motorizado | undefined> {
      return this.createQueryBuilder("motorizado")
        .leftJoinAndSelect("motorizado.usuario", "usuario")
        .where("usuario.id = :id_usuario", { id_usuario })
        .getOne();
    },
    async encontrarPorPlaca(placa: string): Promise<Motorizado | undefined> {
      return this.createQueryBuilder("motorizado")
        .where("motorizado.placa = :placa", { placa })
        .getOne();
    },
    async listarPorCiudad(ciudad: string): Promise<Motorizado[]> {
      return this.createQueryBuilder("motorizado")
        .leftJoinAndSelect("motorizado.ciudad", "ciudad")
        .where("ciudad.id = :ciudad", { ciudad })
        .getMany();
    }
  })

export default MotorizadoRepository
