import { Pedido } from "../models/Pedido"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const PedidoRepository = dataSource
  .getRepository(Pedido) 
  .extend({
  })

export default PedidoRepository
