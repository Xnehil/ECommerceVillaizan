import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

import PedidoService from "../../../../services/Pedido";
import { Pedido } from "src/models/Pedido";

/**
 * @swagger
 * /pedido/usuarioCarrito:
 *   get:
 *     summary: Recupera las últimas ordenes de un usuario
 *     description: Recupera las últimas ordenes de un usuario
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         description: El ID del usuario
 *         schema:
 *           type: string
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         required: false
 *         description: Estado del pedido (carrito, solicitado, verificado, enProgreso, entregado, cancelado, noCarrito)
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
    const id = req.query.id as string;
    const estado = req.query.estado as string;
    const validEstados = ['carrito', 'solicitado', 'verificado', 'enProgreso', 'entregado', 'cancelado', 'noCarrito'];
    const filter: { estado?: string | string[] } = {};

    if (Array.isArray(estado)) {
        const filteredEstados = estado.filter(e => validEstados.includes(e));
        if (filteredEstados.length > 0) {
            filter.estado = filteredEstados;
        }
    } else if (validEstados.includes(estado)) {
        if (estado === 'noCarrito') {
            filter.estado = '!= carrito';
        } else {
            filter.estado = estado;
        }
    }

    // console.log("id", id);
    try {
        const pedidos = await pedidoService.encontrarPorUsuarioId(id, filter);
        if (pedidos) {
            res.json({ pedidos });
        } else {
            res.status(404).json({ error: "Pedidos no encontrados" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const AUTHENTICATE = false;