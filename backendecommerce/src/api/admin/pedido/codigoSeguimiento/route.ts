import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa"

import PedidoService from "../../../../services/Pedido"
import { Pedido } from "src/models/Pedido";

/**
 * @swagger
 * /pedido/codigoSeguimiento/:
 *   post:
 *     summary: Buscar pedidos por código de seguimiento
 *     description: Endpoint para buscar pedidos utilizando un código de seguimiento.
 *     tags:
 *       - Pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               codigoSeguimiento:
 *                 type: string
 *                 description: Código de seguimiento del pedido
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Lista de pedidos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pedidos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Petición inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Petición inválida"
 *       404:
 *         description: Pedido no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Pedido no encontrado"
 */

interface PedidoRequestBody {
    codigoSeguimiento: string;
}

export const POST = async (
    req: MedusaRequest & { body: PedidoRequestBody },
    res: MedusaResponse
) => {
    const pedidoService: PedidoService = req.scope.resolve("pedidoService");
    const { codigoSeguimiento } = req.body;

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }

    try {
        const pedido = await pedidoService.buscarPorCodigoSeguimiento(codigoSeguimiento);
        res.json({ pedido });
    } catch (error) {
        res.status(404).json({ error: "Pedido no encontrado" });
    }
};

export const AUTHENTICATE = false;