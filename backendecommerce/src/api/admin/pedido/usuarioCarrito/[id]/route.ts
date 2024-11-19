import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

import PedidoService from "../../../../../services/Pedido";
import { Pedido } from "src/models/Pedido";

/**
 * @swagger
 * /pedido/usuarioCarrito/{id}:
 *   get:
 *     summary: Retrieve the latest order by user ID
 *     description: Fetches the most recent order for a given user ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A JSON object containing the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pedido:
 *                   $ref: '#/components/schemas/Pedido'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Pedido no encontrado
 */


export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const pedidoService: PedidoService = req.scope.resolve("pedidoService");
    const { id } = req.params;
    try {
        const pedido = await pedidoService.encontrarUltimoCarritoPorUsuarioIdYTengaAlgunDetalleActivo(id);
        res.json({ pedido });
    } catch (error) {
        res.status(404).json({ error: "Pedido no encontrado" });
    }
};



export const AUTHENTICATE = false;
