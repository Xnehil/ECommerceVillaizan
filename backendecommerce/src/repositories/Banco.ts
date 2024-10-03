import { Banco } from "../models/Banco"
import { dataSource } from "@medusajs/medusa/dist/loaders/database"

export const BancoRepository = dataSource
  .getRepository(Banco)
  .extend({
  })

export default BancoRepository;
