import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import PedidoXMetodoPagoService from "../../../../services/PedidoXMetodoPago";
import { PedidoXMetodoPago } from "src/models/PedidoXMetodoPago";

/**
 * @swagger
 * tags:
 *   name: PedidoXMetodoPagos
 *   description: API para la gestión de pedidos por método de pago
 */


/**
 * @swagger
 * /pedidoXMetodoPago/pedido:
 *   post:
 *     summary: List PedidoXMetodoPago by Pedido ID
 *     description: Retrieves a list of PedidoXMetodoPago records associated with a given Pedido ID.
 *     tags:
 *       - PedidoXMetodoPago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_pedido:
 *                 type: string
 *                 description: The ID of the Pedido.
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: A list of PedidoXMetodoPago records.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pedidoXMetodoPago:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PedidoXMetodoPago'
 *       404:
 *         description: PedidoXMetodoPago not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "PedidoXMetodoPago no encontrado"
 *       400:
 *         description: Invalid request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Petición inválida"
 */

interface MetodoXMetodoPagoRequestBody {
    id_pedido: string;
}


export const POST = async (
    req: MedusaRequest & { body: MetodoXMetodoPagoRequestBody },
    res: MedusaResponse
) => {
    const pedidoXMetodoPagoService: PedidoXMetodoPagoService = req.scope.resolve("pedidoxmetodopagoService");
    const { id } = req.params;
    const { id_pedido } = req.body;
    const pedidoXMetodoPagoData = req.body as Partial<PedidoXMetodoPago>;

    try {
        const pedidoXMetodoPago = await pedidoXMetodoPagoService.listarPorPedido(id_pedido);
        res.json({ pedidoXMetodoPago });
    } catch (error) {
        if (error.message === "PedidoXMetodoPago no encontrado") {
            res.status(404).json({ error: "PedidoXMetodoPago no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};



export const AUTHENTICATE = false;