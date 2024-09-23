import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import MetodoPagoService from "../../../services/MetodoPago";
import { MetodoPago } from "src/models/MetodoPago";

/**
 * @swagger
 * tags:
 *   name: MetodoPagos
 *   description: API para la gestión de métodos de pago
 */

/**
 * @swagger
 * /metodopagos:
 *   get:
 *     summary: Lista todos los métodos de pago con paginación
 *     tags: [MetodoPagos]
 *     responses:
 *       200:
 *         description: Una lista de métodos de pago
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metodopagos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MetodoPago'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const metodoPagoService: MetodoPagoService = req.scope.resolve("metodopagoService");

    res.json({
        metodoPagos: await metodoPagoService.listarConPaginacion(),
    });
};

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const metodoPagoService: MetodoPagoService = req.scope.resolve("metodopagoService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const metodoPagoData = req.body as MetodoPago;
    const metodoPago = await metodoPagoService.crear(metodoPagoData);

    res.json({
        metodoPago,
    });
};

export const AUTHENTICATE = false;
