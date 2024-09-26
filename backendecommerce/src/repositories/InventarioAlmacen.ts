import { InventarioAlmacen } from "../models/InventarioAlmacen"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const InventarioAlmacenRepository = dataSource
  .getRepository(InventarioAlmacen)
  .extend({
    async findByAlmacenId(almacenId: string) {
      return this.find({
        where: {
          almacen: {
            id: almacenId,
          },
        },
        relations: ['almacen', 'producto'],
      });
    },

    async findByProductoId(productoId: string) {
      return this.find({
        where: {
          producto: {
            id: productoId,
          },
        },
        relations: ['almacen', 'producto'],
      });
    },
  });

export default InventarioAlmacenRepository
