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
    async findByMotorizadoId(id_motorizado: string, estados: string | string[] = []): Promise<Pedido[]> {
      const queryBuilder = this.createQueryBuilder("pedido")
      .leftJoinAndSelect("pedido.direccion", "direccion")
      .leftJoinAndSelect("direccion.ciudad", "ciudad")
      .leftJoinAndSelect("direccion.ubicacion", "ubicacion")
      .leftJoinAndSelect("pedido.usuario", "usuario")
      .leftJoinAndSelect("pedido.motorizado", "motorizado")
      .leftJoinAndSelect("pedido.pedidosXMetodoPago", "pedidosXMetodoPago")
      .leftJoinAndSelect("pedidosXMetodoPago.metodoPago", "metodoPago")
      .where("motorizado.id = :id_motorizado", { id_motorizado });
  
    if (Array.isArray(estados) && estados.length > 0) {
      queryBuilder.andWhere("pedido.estado IN (:...estados)", { estados });
    } else if (typeof estados === "string" && estados) {
      queryBuilder.andWhere("pedido.estado = :estado", { estado: estados });
    }
  
    return queryBuilder.getMany();
    },
    async findByCodigoSeguimiento(codigoSeguimiento: string): Promise<Pedido> {
      return this.createQueryBuilder("pedido")
        .leftJoinAndSelect("pedido.direccion", "direccion")
        .leftJoinAndSelect("direccion.ciudad", "ciudad") // Add this line to include ciudad
        .leftJoinAndSelect("pedido.motorizado", "motorizado")
        .leftJoinAndSelect("pedido.usuario", "usuario")
        .where("pedido.codigoSeguimiento = :codigoSeguimiento", { codigoSeguimiento })
        .getOne();
    },
    async encontrarUltimoPorUsuarioId(id_usuario: string): Promise<Pedido> {
      return this.createQueryBuilder("pedido")
        .leftJoinAndSelect("pedido.direccion", "direccion")
        .leftJoinAndSelect("direccion.ciudad", "ciudad") // Add this line to include ciudad
        .leftJoinAndSelect("pedido.motorizado", "motorizado")
        .leftJoinAndSelect("pedido.usuario", "usuario")      
        .where("pedido.id_usuario = :id_usuario", { id_usuario })
        .orderBy("pedido.creadoEn", "DESC")
        .getOne();
    },
    async encontrarUltimoCarritoPorUsuarioId(id_usuario: string): Promise<Pedido> {
      return this.createQueryBuilder("pedido")
        .leftJoinAndSelect("pedido.direccion", "direccion")
        .leftJoinAndSelect("direccion.ciudad", "ciudad") // Add this line to include ciudad
        .leftJoinAndSelect("pedido.motorizado", "motorizado")
        .leftJoinAndSelect("pedido.usuario", "usuario")
        .where("pedido.id_usuario = :id_usuario", { id_usuario })
        .andWhere("pedido.estado = 'carrito'")
        .orderBy("pedido.creadoEn", "DESC")
        .getOne();
    }
  })

export default PedidoRepository
