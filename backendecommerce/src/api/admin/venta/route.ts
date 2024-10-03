import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import VentaService from "../../../services/Venta";
import { Venta } from "src/models/Venta";

/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: API para la gestión de ventas
 */

/**
 * @swagger
 * /venta:
 *   get:
 *     summary: Lista todas las ventas con paginación
 *     tags: [Ventas]
 *     responses:
 *       200:
 *         description: Una lista de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ventas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Venta'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ventaService: VentaService = req.scope.resolve("ventaService");

    res.json({
        ventas: await ventaService.listarConPaginacion(),
    });
};

/**
 * @swagger
 * /venta:
 *   post:
 *     summary: Crea una nueva venta
 *     tags: [Venta]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Venta'
 *     responses:
 *       201:
 *         description: La venta ha sido creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venta'
 *       400:
 *         description: Petición inválida
 */

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ventaService: VentaService = req.scope.resolve("ventaService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const ventaData = req.body as Venta;
    const venta = await ventaService.crear(ventaData);

    res.json({
        venta,
    });
};


export const AUTHENTICATE = false;
