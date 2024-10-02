import { Ubicacion } from "../models/Ubicacion"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const UbicacionRepository = dataSource
  .getRepository(Ubicacion)
  .extend({
  })

export default UbicacionRepository
