import { PedidoXMetodoPago } from "../models/PedidoXMetodoPago"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const PedidoXMetodoPagoRepository = dataSource
  .getRepository(PedidoXMetodoPago) 
  .extend({
    async encontrarPorIdPedido(idPedido : string): Promise<PedidoXMetodoPago[]> {
        return this.find({
          where: {
            pedido:{
                id: idPedido
            }
          },
          relations: ['pedido', 'metodoPago'],
        });
    }
  })

export default PedidoXMetodoPagoRepository