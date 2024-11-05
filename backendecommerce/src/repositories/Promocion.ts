import { Promocion } from "../models/Promocion"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const PromocionRepository = dataSource
  .getRepository(Promocion)
  .extend({
  })

export default PromocionRepository