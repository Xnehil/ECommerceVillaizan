import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  FrutaService  from "../../../services/Fruta"
import { Fruta } from "src/models/Fruta";

/**
 * @swagger
 * tags:
 *  name: Frutas
 * description: API para frutas
 * 
  */


 /**
 * @swagger
 * /frutas:
 *   get:
 *     summary: Lista todas las frutas con paginación
 *     tags: [Frutas]
 *     responses:
 *       200:
 *         description: Una lista de frutas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 frutas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Fruta'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const frutaService: FrutaService = req.scope.resolve("frutaService");

    res.json({
      frutas: await frutaService.listarConPaginacion(),
    })
  }

  /**
 * @swagger
 * /frutas:
 *   post:
 *     summary: Crea una nueva fruta
 *     tags: [Frutas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fruta'
 *     responses:
 *       201:
 *         description: La fruta ha sido creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Fruta'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const frutaService: FrutaService = req.scope.resolve("frutaService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const frutaData = req.body as Fruta;
    const fruta = await frutaService.crear(frutaData);

    res.status(201).json({
      fruta,
    });
  }

  export const AUTHENTICATE = false