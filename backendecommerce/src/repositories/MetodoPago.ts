import { MetodoPago } from "../models/MetodoPago"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const MetodoPagoRepository = dataSource
  .getRepository(MetodoPago)
  .extend({
    async buscarPorNombre(nombre: string): Promise<MetodoPago | undefined> {
      return this.createQueryBuilder("metodoPago")
        .where("metodoPago.nombre = :nombre", { nombre })
        .getOne();
    }
  })

export default MetodoPagoRepository
