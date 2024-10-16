import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  TipoProductoService  from "../../../services/TipoProducto"
import { TipoProducto } from "src/models/TipoProducto";
/**
 * @swagger
 * tags:
 *   name: TipoProductos
 *   description: API para tipo de productos
 */

/**
 * @swagger
 * /tipoProducto:
 *   get:
 *     summary: Lista todos los tipoProductos con paginación
 *     tags: [TipoProducto]
 *     responses:
 *       200:
 *         description: Una lista de tipoProductos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tipoProductos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TipoProducto'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const tipoProductoService: TipoProductoService = req.scope.resolve("tipoproductoService");

    res.json({
      tipoProductos: await tipoProductoService.listarConPaginacion(),
    })
  }

  /**
 * @swagger
 * /tipoProducto:
 *   post:
 *     summary: Crea un nuevo tipoProducto
 *     tags: [TipoProducto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TipoProducto'
 *     responses:
 *       201:
 *         description: El tipoProducto ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoProducto'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const tipoProductoService: TipoProductoService = req.scope.resolve("tipoproductoService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const tipoProductoData = req.body as TipoProducto;
    const respuesta = await tipoProductoService.crear(tipoProductoData);
    if (respuesta.alreadyExists) {
      res.status(222).json({
        tipoProducto: respuesta.tipoProducto,
        message: "El tipoProducto ya existe",
      });
      return;
    }

    const tipoProducto = respuesta.tipoProducto;
    res.status(201).json({
      tipoProducto,
    });
  }

  export const AUTHENTICATE = false