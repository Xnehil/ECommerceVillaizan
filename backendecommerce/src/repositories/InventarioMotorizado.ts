import { InventarioMotorizado } from "../models/InventarioMotorizado"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const InventarioMotorizadoRepository = dataSource
  .getRepository(InventarioMotorizado)
  .extend({
    async findByMotorizadoId(motorizadoId: string): Promise<InventarioMotorizado[]> {
      return this.createQueryBuilder("inventarioMotorizado")
        .leftJoinAndSelect("inventarioMotorizado.motorizado", "motorizado")
        .leftJoinAndSelect("inventarioMotorizado.producto", "producto")
        .leftJoinAndSelect("motorizado.usuario", "usuario")
        .where("motorizado.id = :motorizadoId", { motorizadoId })
        .getMany();
    },

    async findByProductoId(productoId: string) {
      return this.find({
        where: {
          producto: {
            id: productoId,
          },
        },
        relations: ['motorizado', 'producto'],
      });
      
    },
  });

export default InventarioMotorizadoRepository
