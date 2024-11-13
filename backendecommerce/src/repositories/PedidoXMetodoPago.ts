import { PedidoXMetodoPago } from "../models/PedidoXMetodoPago"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const PedidoXMetodoPagoRepository = dataSource
  .getRepository(PedidoXMetodoPago) 
  .extend({
  })

export default PedidoXMetodoPagoRepository