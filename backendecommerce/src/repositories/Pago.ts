import { Pago } from "../models/Pago"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const PagoRepository = dataSource
  .getRepository(Pago)
  .extend({
  })

export default PagoRepository
