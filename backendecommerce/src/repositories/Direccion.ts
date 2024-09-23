import { Direccion } from "../models/Direccion"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const DireccionRepository = dataSource
  .getRepository(Direccion)
  .extend({
  })

export default DireccionRepository
