import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  ProductoService  from "../../../services/Producto"
import { Producto } from "src/models/Producto";

  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const productoService: ProductoService = req.scope.resolve("productoService");

    res.json({
      productos: await productoService.listarConPaginacion(),
    })
  }

  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const productoService: ProductoService = req.scope.resolve("productoService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const productoData = req.body as Producto;
    const producto = await productoService.crear(productoData);

    res.json({
      producto,
    });
  }

  export const AUTHENTICATE = false