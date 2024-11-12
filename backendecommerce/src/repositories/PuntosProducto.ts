import { PuntosProducto } from "../models/PuntosProducto"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const PuntosProductoRepository = dataSource
  .getRepository(PuntosProducto) 
  .extend({
    async encontrarPuntosPorProductoActivo(idProducto : string): Promise<PuntosProducto> {
        return this.findOne({
          where: {
            producto:{
                id: idProducto
            },
            estado: true

          },
          relations: ['producto'],
        });
    }
  })

export default PuntosProductoRepository