import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  LibroReclamacionesService  from "../../../services/LibroReclamaciones"
import { LibroReclamaciones } from "src/models/LibroReclamaciones";

  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const libroReclamacionesService: LibroReclamacionesService = req.scope.resolve("libroReclamacionesService");

    res.json({
      libroReclamacioness: await libroReclamacionesService.listarConPaginacion(),
    })
  }

  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const libroReclamacionesService: LibroReclamacionesService = req.scope.resolve("libroReclamacionesService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const libroReclamacionesData = req.body as LibroReclamaciones;
    const libroReclamaciones = await libroReclamacionesService.crear(libroReclamacionesData);

    res.json({
      libroReclamaciones,
    });
  }

  export const AUTHENTICATE = false