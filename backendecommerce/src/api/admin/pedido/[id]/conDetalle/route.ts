import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import PedidoService from "@services/Pedido";
import { Pedido } from "src/models/Pedido";

/**
 * @swagger
 * /pedido/{id}/conDetalle:
 *   get:
 *     summary: Recupera un pedido por ID con detalles de productos
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pedido
 *       - in: query
 *         name: pedido
 *         schema:
 *           type: string
 *         required: false
 *         description: Incluir detalles del pedido
 *     responses:
 *       200:
 *         description: Detalles del pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Pedido no encontrado
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pedidoService: PedidoService = req.scope.resolve("pedidoService");
    const id  = req.params.id;
    const  pedido  = req.query.pedido === 'true';
    const relations = pedido ? ["motorizado", "motorizado.usuario", "direccion", "usuario", "pedidosXMetodoPago", "pedidosXMetodoPago.metodoPago"] : [];

    try {
        const pedidoData = await pedidoService.recuperarConDetalle(id, { relations });
        res.json({ pedido: pedidoData });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: "Pedido no encontrado" });
    }
};

export const AUTHENTICATE = false;