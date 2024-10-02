import { MetodoPago } from "../models/MetodoPago"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const MetodoPagoRepository = dataSource
  .getRepository(MetodoPago)
  .extend({
  })

export default MetodoPagoRepository
