import { OrdenSerie } from "../models/OrdenSerie"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const OrdenSerieRepository = dataSource
  .getRepository(OrdenSerie)
  .extend({
  })

export default OrdenSerieRepository
