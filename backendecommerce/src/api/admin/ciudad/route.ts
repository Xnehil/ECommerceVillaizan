import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  CiudadService  from "../../../services/Ciudad"
import { Ciudad } from "src/models/Ciudad";

/**
 * @swagger
 * tags:
 *   name: Ciudades
 *   description: API para la gestión de ciudades
 */

/**
 * @swagger
 * /ciudades:
 *   get:
 *     summary: Lista todas los ciudades con paginación
 *     tags: [Ciudades]
 *     responses:
 *       200:
 *         description: Una lista de ciudades
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ciudades:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ciudad'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const ciudadService: CiudadService = req.scope.resolve("ciudadService");

    res.json({
      ciudades: await ciudadService.listarConPaginacion(),
    })
  }

  /**
 * @swagger
 * /ciudades:
 *   post:
 *     summary: Crea una nueva ciudad
 *     tags: [Ciudades]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ciudad'
 *     responses:
 *       201:
 *         description: La ciudad ha sido creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ciudad'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const ciudadService: CiudadService = req.scope.resolve("ciudadService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const ciudadData = req.body as Ciudad;
    const ciudad = await ciudadService.crear(ciudadData);

    res.status(201).json({
      ciudad,
    });
  }

  export const AUTHENTICATE = false