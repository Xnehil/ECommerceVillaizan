import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import DetallePedidoService from "../../../services/DetallePedido";
import { DetallePedido } from "src/models/DetallePedido";

/**
 * @swagger
 * tags:
 *   name: DetallePedidos
 *   description: API para la gestión de detalle de pedidos
 */

/**
 * @swagger
 * /detallePedidos:
 *   get:
 *     summary: Lista todos los detalles de pedidos con paginación
 *     tags: [DetallePedidos]
 *     responses:
 *       200:
 *         description: Una lista de detalles de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 detallePedidos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DetallePedido'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const detallePedidoService: DetallePedidoService = req.scope.resolve("detallepedidoService");

    res.json({
        detallePedidos: await detallePedidoService.listarConPaginacion(),
    });
};

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const detallePedidoService: DetallePedidoService = req.scope.resolve("detallepedidoService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const detallePedidoData = req.body as DetallePedido;
    const detallePedido = await detallePedidoService.crear(detallePedidoData);

    res.json({
        detallePedido,
    });
};

export const AUTHENTICATE = false;
