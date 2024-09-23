import { Ciudad } from "../models/Ciudad"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const CiudadRepository = dataSource
  .getRepository(Ciudad)
  .extend({
  })

export default CiudadRepository
