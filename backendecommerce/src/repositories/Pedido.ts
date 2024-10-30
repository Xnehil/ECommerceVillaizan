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
      return this.createQueryBuilder("pedido")
        .leftJoinAndSelect("pedido.direccion", "direccion")
        .leftJoinAndSelect("pedido.usuario", "usuario")
        .leftJoinAndSelect("pedido.motorizado", "motorizado")
        .where("motorizado.id = :id_motorizado", { id_motorizado })
        .getMany();
    },
    async findByCodigoSeguimiento(codigoSeguimiento: string): Promise<Pedido> {
      return this.createQueryBuilder("pedido")
        .leftJoinAndSelect("pedido.direccion", "direccion")
        .leftJoinAndSelect("pedido.motorizado", "motorizado")
        .leftJoinAndSelect("pedido.usuario", "usuario")
        .where("pedido.codigoSeguimiento = :codigoSeguimiento", { codigoSeguimiento })
        .getOne();
    },
    async encontrarUltimoPorUsuarioId(id_usuario: string): Promise<Pedido> {
      return this.createQueryBuilder("pedido")
        .leftJoinAndSelect("pedido.direccion", "direccion")
        .leftJoinAndSelect("pedido.motorizado", "motorizado")
        .leftJoinAndSelect("pedido.usuario", "usuario")      
        .where("pedido.id_usuario = :id_usuario", { id_usuario })
        .orderBy("pedido.creadoEn", "DESC")
        .getOne();
    },
    async encontrarUltimoCarritoPorUsuarioId(id_usuario: string): Promise<Pedido> {
      return this.createQueryBuilder("pedido")
        .leftJoinAndSelect("pedido.direccion", "direccion")
        .leftJoinAndSelect("pedido.motorizado", "motorizado")
        .leftJoinAndSelect("pedido.usuario", "usuario")
        .where("pedido.id_usuario = :id_usuario", { id_usuario })
        .andWhere("pedido.estado = 'carrito'")
        .orderBy("pedido.creadoEn", "DESC")
        .getOne();
    }
  })

export default PedidoRepository
