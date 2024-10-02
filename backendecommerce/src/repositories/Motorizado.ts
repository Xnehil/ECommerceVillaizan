import { Motorizado } from "../models/Motorizado"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const MotorizadoRepository = dataSource
  .getRepository(Motorizado)
  .extend({
  })

export default MotorizadoRepository
