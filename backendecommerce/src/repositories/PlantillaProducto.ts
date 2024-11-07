import { PlantillaProducto } from "../models/PlantillaProducto"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const PlantillaProductoRepository = dataSource
  .getRepository(PlantillaProducto)
  .extend({
  })

export default PlantillaProductoRepository;
