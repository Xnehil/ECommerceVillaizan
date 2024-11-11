import { DetallePedido } from "../models/DetallePedido"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const DetallePedidoRepository = dataSource
  .getRepository(DetallePedido)
  .extend({
    async encontrarDetallesPedidoPorPromocionYCarrito(id_promocion: string): Promise<DetallePedido[]> {
      return this.createQueryBuilder("detallePedido")
        .leftJoinAndSelect("detallePedido.pedido", "pedido")
        .leftJoinAndSelect("detallePedido.promocion", "promocion")
        .leftJoinAndSelect("detallePedido.producto", "producto")
        .where("detallePedido.promocion.id = :id_promocion", { id_promocion })
        .andWhere("pedido.estado = :estado", { estado: "carrito" })
        .getMany();
    },
  })

export default DetallePedidoRepository