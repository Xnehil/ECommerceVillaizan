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
    const productoService = new ProductoService(req.scope.resolve("ProductoService"));

    res.json({
      productos: await productoService.listarConPaginacion(),
    })
  }

  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const productoService = new ProductoService(req.scope.resolve("ProductoService"));

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