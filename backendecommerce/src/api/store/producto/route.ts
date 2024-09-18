import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  ProductoService  from "../../../services/Producto"

  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const productoService = new ProductoService(req.scope.resolve("ProductoService"));

    res.json({
      productos: await productoService.listarConPaginacion(),
    })
  }
  