import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  InventarioMotorizadoService  from "../../../services/InventarioMotorizado"
import { InventarioMotorizado } from "src/models/InventarioMotorizado";

/**
 * @swagger
 * tags:
 *   name: InventarioMotorizadoes
 *   description: API para la gestión de inventarioMotorizadoes
 */

/**
 * @swagger
 * /inventarioMotorizadoes:
 *   get:
 *     summary: Lista todos los inventarioMotorizadoes con paginación
 *     tags: [InventarioMotorizados]
 *     responses:
 *       200:
 *         description: Una lista de inventarioMotorizadoes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inventarioMotorizadoes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventarioMotorizado'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioMotorizadoService: InventarioMotorizadoService = req.scope.resolve("inventariomotorizadoService");

    res.json({
      inventarioMotorizadoes: await inventarioMotorizadoService.listarConPaginacion(),
    })
  }

  /**
 * @swagger
 * /inventarioMotorizadoes:
 *   post:
 *     summary: Crea un nuevo inventarioMotorizado
 *     tags: [InventarioMotorizados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventarioMotorizado'
 *     responses:
 *       201:
 *         description: El inventarioMotorizado ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventarioMotorizado'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioMotorizadoService: InventarioMotorizadoService = req.scope.resolve("inventariomotorizadoService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const inventarioMotorizadoData = req.body as InventarioMotorizado;
    const inventarioMotorizado = await inventarioMotorizadoService.crear(inventarioMotorizadoData);

    res.status(201).json({
      inventarioMotorizado,
    });
  }

  export const AUTHENTICATE = false