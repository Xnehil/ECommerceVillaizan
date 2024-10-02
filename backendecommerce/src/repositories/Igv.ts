import { Igv } from "../models/Igv"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const IgvRepository = dataSource
  .getRepository(Igv)
  .extend({
  })

export default IgvRepository
