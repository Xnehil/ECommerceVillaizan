import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  ProductoService  from "../../../services/Producto"
import { Producto } from "src/models/Producto";
/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: API para la gestión de productos
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Lista todos los productos con paginación
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Una lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Producto'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const productoService: ProductoService = req.scope.resolve("productoService");

    res.json({
      productos: await productoService.listarConPaginacion(),
    })
  }


  /**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: El producto ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const productoService: ProductoService = req.scope.resolve("productoService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const productoData = req.body as Producto;
    const producto = await productoService.crear(productoData);

    res.status(201).json({
      producto,
    });
  }

  
  export const AUTHENTICATE = false