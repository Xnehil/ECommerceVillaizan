import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  UbicacionService  from "../../../services/Ubicacion"
import { Ubicacion } from "src/models/Ubicacion";

/**
 * @swagger
 * tags:
 *   name: Ubicaciones
 *   description: API para la gestión de ubicaciones
 */

/**
 * @swagger
 * /ubicaciones:
 *   get:
 *     summary: Lista todos los ubicaciones con paginación
 *     tags: [Ubicaciones]
 *     responses:
 *       200:
 *         description: Una lista de ubicaciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ubicaciones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ubicacion'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const ubicacionService: UbicacionService = req.scope.resolve("ubicacionService");

    res.json({
      ubicaciones: await ubicacionService.listarConPaginacion(),
    })
  }

  /**
 * @swagger
 * /ubicaciones:
 *   post:
 *     summary: Crea una nueva ubicación
 *     tags: [Ubicaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ubicacion'
 *     responses:
 *       201:
 *         description: La ubicación ha sido creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ubicacion'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const ubicacionService: UbicacionService = req.scope.resolve("ubicacionService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const ubicacionData = req.body as Ubicacion;
    const ubicacion = await ubicacionService.crear(ubicacionData);

    res.status(201).json({
      ubicacion,
    });
  }

  export const AUTHENTICATE = false