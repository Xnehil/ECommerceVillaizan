import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  MotorizadoService  from "../../../services/Motorizado"
import { Motorizado } from "src/models/Motorizado";

/**
 * @swagger
 * tags:
 *   name: Motorizadoes
 *   description: API para la gestión de motorizadoes
 */

/**
 * @swagger
 * /motorizado:
 *   get:
 *     summary: Lista todos los motorizadoes con paginación
 *     tags: [Motorizados]
 *     responses:
 *       200:
 *         description: Una lista de motorizadoes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 motorizadoes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Motorizado'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const motorizadoService: MotorizadoService = req.scope.resolve("motorizadoService");

    res.json({
      motorizadoes: await motorizadoService.listarConPaginacion(),
    })
  }

  /**
 * @swagger
 * /motorizado:
 *   post:
 *     summary: Crea un nuevo  motorizado
 *     tags: [Motorizados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Motorizado'
 *     responses:
 *       201:
 *         description: El motorizado ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Motorizado'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const motorizadoService: MotorizadoService = req.scope.resolve("motorizadoService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const motorizadoData = req.body as Motorizado;
    const motorizado = await motorizadoService.crear(motorizadoData);

    res.status(201).json({
      motorizado,
    });
  }

  export const AUTHENTICATE = false