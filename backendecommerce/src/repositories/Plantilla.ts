import { Plantilla } from "../models/Plantilla"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const PlantillaRepository = dataSource
  .getRepository(Plantilla)
  .extend({
  })

export default PlantillaRepository;
