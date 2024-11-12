import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa"

import PuntosProductoService from "../../../services/PuntosProducto"
import { PuntosProducto } from "src/models/PuntosProducto";

/**
 * @swagger
 * tags:
 *   name: PuntosProductos
 *   description: API para puntos de productos
 */

/**
 * @swagger
 * /puntosProducto:
 *   get:
 *     summary: Lista todos los puntosProductos con paginación
 *     tags: [PuntosProducto]
 *     responses:
 *       200:
 *         description: Una lista de puntosProductos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 puntosProductos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PuntosProducto'
 */
export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const puntosProductoService: PuntosProductoService = req.scope.resolve("puntosproductoService");

    res.json({
        puntosProductos: await puntosProductoService.listarConPaginacion(),
    })
}

/**
 * @swagger
 * /puntosProducto:
 *   post:
 *     summary: Crea un nuevo puntosProducto
 *     tags: [PuntosProducto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PuntosProducto'
 *     responses:
 *       201:
 *         description: El puntosProducto ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PuntosProducto'
 *       400:
 *         description: Petición inválida
 */
export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const puntosProductoService: PuntosProductoService = req.scope.resolve("puntosproductoService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const puntosProductoData = req.body as PuntosProducto;
    const puntosProducto = await puntosProductoService.crear(puntosProductoData);
    res.status(201).json({
        puntosProducto,
    });
}

export const AUTHENTICATE = false