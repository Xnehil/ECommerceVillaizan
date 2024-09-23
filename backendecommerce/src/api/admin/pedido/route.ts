import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import PedidoService from "../../../services/Pedido";
import { Pedido } from "src/models/Pedido";

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: API para la gestión de pedidos
 */

/**
 * @swagger
 * /pedidos:
 *   get:
 *     summary: Lista todos los pedidos con paginación
 *     tags: [Pedidos]
 *     responses:
 *       200:
 *         description: Una lista de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pedidos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pedido'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pedidoService: PedidoService = req.scope.resolve("pedidoService");

    res.json({
        pedidos: await pedidoService.listarConPaginacion(),
    });
};

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pedidoService: PedidoService = req.scope.resolve("pedidoService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const pedidoData = req.body as Pedido;
    const pedido = await pedidoService.crear(pedidoData);

    res.json({
        pedido,
    });
};

export const AUTHENTICATE = false;
