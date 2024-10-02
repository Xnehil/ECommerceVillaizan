import { DetallePedido } from "../models/DetallePedido"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const DetallePedidoRepository = dataSource
  .getRepository(DetallePedido)
  .extend({
  })

export default DetallePedidoRepository
