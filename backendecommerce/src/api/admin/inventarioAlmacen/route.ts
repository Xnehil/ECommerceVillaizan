import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  InventarioAlmacenService  from "../../../services/InventarioAlmacen"
import { InventarioAlmacen } from "src/models/InventarioAlmacen";

/**
 * @swagger
 * tags:
 *   name: InventariosAlmacen
 *   description: API para la gestión de inventarios de almacén
 */

/**
 * @swagger
 * /inventariosalmacen:
 *   get:
 *     summary: Lista todos los inventarios de almacén con paginación
 *     tags: [InventariosAlmacen]
 *     responses:
 *       200:
 *         description: Una lista de inventarios de almacén
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inventarioAlmacens:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventarioAlmacen'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioAlmacenService: InventarioAlmacenService = req.scope.resolve("inventarioalmacenService");

    res.json({
      inventarioAlmacens: await inventarioAlmacenService.listarConPaginacion(),
    })
  }

  /**
 * @swagger
 * /inventariosalmacen:
 *   post:
 *     summary: Crea un nuevo inventario de almacén
 *     tags: [InventariosAlmacen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventarioAlmacen'
 *     responses:
 *       201:
 *         description: El inventario de almacén ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventarioAlmacen'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioAlmacenService: InventarioAlmacenService = req.scope.resolve("inventarioalmacenService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const inventarioAlmacenData = req.body as InventarioAlmacen;
    const inventarioAlmacen = await inventarioAlmacenService.crear(inventarioAlmacenData);

    res.status(201).json({
      inventarioAlmacen,
    });
  }

  

  export const AUTHENTICATE = false