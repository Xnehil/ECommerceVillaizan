import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  AlmacenService  from "../../../services/Almacen"
import { Almacen } from "src/models/Almacen";

/**
 * @swagger
 * tags:
 *   name: Almacenes
 *   description: API para la gestión de almacenes
 */

/**
 * @swagger
 * /almacenes:
 *   get:
 *     summary: Lista todos los almacenes con paginación
 *     tags: [Almacenes]
 *     responses:
 *       200:
 *         description: Una lista de almacenes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 almacens:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Almacen'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const almacenService: AlmacenService = req.scope.resolve("almacenService");

    res.json({
      almacens: await almacenService.listarConPaginacion(),
    })
  }

  /**
 * @swagger
 * /almacenes:
 *   post:
 *     summary: Crea un nuevo almacén
 *     tags: [Almacenes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Almacen'
 *     responses:
 *       201:
 *         description: El almacén ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Almacen'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const almacenService: AlmacenService = req.scope.resolve("almacenService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const almacenData = req.body as Almacen;
    const almacen = await almacenService.crear(almacenData);

    res.status(201).json({
      almacen,
    });
  }

  export const AUTHENTICATE = false