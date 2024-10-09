import { Pedido } from "../models/Pedido"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const PedidoRepository = dataSource
  .getRepository(Pedido) 
  .extend({
    async encontrarPorUsuarioId(id_usuario: string): Promise<Pedido[]> {
      return this.createQueryBuilder("pedido")
        .leftJoinAndSelect("pedido.usuario", "usuario")
        .where("usuario.id = :id_usuario", { id_usuario })
        .getMany();
    },
    async findByMotorizadoId(id_motorizado: string): Promise<Pedido[]> {
      return this.createQueryBuilder("pedido")
        .leftJoinAndSelect("pedido.motorizado", "motorizado")
        .where("motorizado.id = :id_motorizado", { id_motorizado })
        .getMany();
    }
  })

export default PedidoRepository
