import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import PagoService from "../../../services/Pago";
import { Pago } from "src/models/Pago";

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: API para la gestión de pagos
 */

/**
 * @swagger
 * /pago:
 *   get:
 *     summary: Lista todos los pagos con paginación
 *     tags: [Pagos]
 *     responses:
 *       200:
 *         description: Una lista de pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pagos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pago'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pagoService: PagoService = req.scope.resolve("pagoService");

    res.json({
        pagos: await pagoService.listarConPaginacion(),
    });
};
/**
 * @swagger
 * /pago:
 *   post:
 *     summary: Crea un nuevo pago
 *     tags: [Pago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pago'
 *     responses:
 *       201:
 *         description: El pago ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       400:
 *         description: Petición inválida
 */
export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pagoService: PagoService = req.scope.resolve("pagoService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const pagoData = req.body as Pago;
    const pago = await pagoService.crear(pagoData);

    res.json({
        pago,
    });
};



export const AUTHENTICATE = false;
