import { Notificacion } from "../models/Notificacion"
import { 
  dataSource,
} from "@medusajs/medusa/dist/loaders/database"

export const NotificacionRepository = dataSource
  .getRepository(Notificacion)
  .extend({
  })

export default NotificacionRepository