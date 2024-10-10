import { Pedido } from "../models/Pedido"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const PedidoRepository = dataSource
  .getRepository(Pedido) 
  .extend({
    async encontrarPorUsuarioId(id_usuario: string): Promise<Pedido[]> {
      return this.find({
        where: {
          usuario: {
            id: id_usuario,
          },
        },
        relations: ['motorizado', 'direccion', 'usuario'],
      });
    },
    async findByMotorizadoId(id_motorizado: string): Promise<Pedido[]> {
        return this.find({
          where: {
            motorizado: {
              id: id_motorizado,
            },
          },
          relations: ['motorizado', 'direccion', 'usuario'],
        });
    }
    
  })

export default PedidoRepository
