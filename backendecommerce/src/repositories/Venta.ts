import { Venta } from "../models/Venta"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const VentaRepository = dataSource
  .getRepository(Venta)
  .extend({
  })

export default VentaRepository
