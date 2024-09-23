import { InventarioMotorizado } from "../models/InventarioMotorizado"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const InventarioMotorizadoRepository = dataSource
  .getRepository(InventarioMotorizado)
  .extend({
  })

export default InventarioMotorizadoRepository
