import { HistorialRepartidor } from "../models/HistorialRepartidor"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const HistorialRepartidorRepository = dataSource
  .getRepository(HistorialRepartidor)
  .extend({
  })

export default HistorialRepartidorRepository