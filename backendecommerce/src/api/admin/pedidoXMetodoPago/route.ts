import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa"

import PedidoXMetodoPagoService from "../../../services/PedidoXMetodoPago"
import { PedidoXMetodoPago } from "src/models/PedidoXMetodoPago";

/**
 * @swagger
 * tags:
 *   name: PedidoXMetodoPagos
 *   description: API para pedidos por método de pago
 */

/**
 * @swagger
 * /pedidoXMetodoPago:
 *   get:
 *     summary: Lista todos los pedidoXMetodoPagos con paginación
 *     tags: [PedidoXMetodoPago]
 *     responses:
 *       200:
 *         description: Una lista de pedidoXMetodoPagos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pedidoXMetodoPagos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PedidoXMetodoPago'
 */
export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pedidoXMetodoPagoService: PedidoXMetodoPagoService = req.scope.resolve("pedidoxmetodopagoService");

    res.json({
        pedidoXMetodoPagos: await pedidoXMetodoPagoService.listarConPaginacion(),
    })
}

/**
 * @swagger
 * /pedidoXMetodoPago:
 *   post:
 *     summary: Crea un nuevo pedidoXMetodoPago
 *     tags: [PedidoXMetodoPago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoXMetodoPago'
 *     responses:
 *       201:
 *         description: El pedidoXMetodoPago ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoXMetodoPago'
 *       400:
 *         description: Petición inválida
 */
export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pedidoXMetodoPagoService: PedidoXMetodoPagoService = req.scope.resolve("pedidoxmetodopagoService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const pedidoXMetodoPagoData = req.body as PedidoXMetodoPago;
    const pedidoXMetodoPago = await pedidoXMetodoPagoService.crear(pedidoXMetodoPagoData);
    res.status(201).json({
        pedidoXMetodoPago,
    });
}

export const AUTHENTICATE = false