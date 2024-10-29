import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  DireccionService  from "../../../services/Direccion"
import { Direccion } from "src/models/Direccion";

/**
 * @swagger
 * tags:
 *   name: Direcciones
 *   description: API para la gestión de direcciones
 */

/**
 * @swagger
 * /direccion:
 *   get:
 *     summary: Lista todas los direcciones con paginación
 *     tags: [Direccion]
 *     responses:
 *       200:
 *         description: Una lista de direcciones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 direcciones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Direccion'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const direccionService: DireccionService = req.scope.resolve("direccionService");

    res.json({
      direcciones: await direccionService.listarConPaginacion(),
    })
  }

  /**
 * @swagger
 * /direccion:
 *   post:
 *     summary: Crea una nueva dirección
 *     tags: [Direccion]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Direccion'
 *     responses:
 *       201:
 *         description: La ubicación ha sido creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Direccion'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const direccionService: DireccionService = req.scope.resolve("direccionService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const direccionData = req.body as Direccion;
    const direccion = await direccionService.crear(direccionData);

    res.status(201).json({
      direccion,
    });
  }

  export const AUTHENTICATE = false