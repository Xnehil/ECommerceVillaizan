import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  AjusteService  from "@services/Ajuste"
import { Ajuste } from "src/models/Ajuste";

/**
 * @swagger
 * tags:
 *   name: Ajustes
 *   description: API para la gestión de ajustes
 */

/**
 * @swagger
 * /ajuste:
 *   get:
 *     summary: Lista todos los ajustes con paginación
 *     tags: [Ajustes]
 *     responses:
 *       200:
 *         description: Una lista de ajustes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ajustes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ajuste'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const ajusteService: AjusteService = req.scope.resolve("ajusteService");

    res.json({
      ajustes: await ajusteService.listarConPaginacion(),
    })
  }

  /**
 * @swagger
 * /ajuste:
 *   post:
 *     summary: Crea un nuevo ajustes
 *     tags: [Ajustes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ajuste'
 *     responses:
 *       201:
 *         description: El ajustes ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ajuste'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const ajusteService: AjusteService = req.scope.resolve("ajusteService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const ajusteData = req.body as Ajuste;
    const ajuste = await ajusteService.crear(ajusteData);

    res.status(201).json({
      ajuste,
    });
  }

  export const AUTHENTICATE = false