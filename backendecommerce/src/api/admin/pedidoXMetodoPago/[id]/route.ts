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
 * /pedidoXMetodoPago/{id}:
 *   get:
 *     summary: Recupera un pedidoXMetodoPago por ID
 *     tags: [PedidoXMetodoPagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pedidoXMetodoPago
 *     responses:
 *       200:
 *         description: Detalles del pedidoXMetodoPago
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoXMetodoPago'
 *       404:
 *         description: PedidoXMetodoPago no encontrado
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pedidoXMetodoPagoService: PedidoXMetodoPagoService = req.scope.resolve("pedidoxmetodopagoService");
    const { id } = req.params;

    try {
        const pedidoXMetodoPago = await pedidoXMetodoPagoService.recuperar(id);
        res.json({ pedidoXMetodoPago });
    } catch (error) {
        res.status(404).json({ error: "PedidoXMetodoPago no encontrado" });
    }
};

/**
 * @swagger
 * /pedidoXMetodoPago/{id}:
 *   put:
 *     summary: Actualiza un pedidoXMetodoPago por ID
 *     tags: [PedidoXMetodoPagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pedidoXMetodoPago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoXMetodoPago'
 *     responses:
 *       200:
 *         description: PedidoXMetodoPago actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PedidoXMetodoPago'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: PedidoXMetodoPago no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pedidoXMetodoPagoService: PedidoXMetodoPagoService = req.scope.resolve("pedidoxmetodopagoService");
    const { id } = req.params;
    const pedidoXMetodoPagoData = req.body as Partial<PedidoXMetodoPago>;

    try {
        const pedidoXMetodoPago = await pedidoXMetodoPagoService.actualizar(id, pedidoXMetodoPagoData);
        res.json({ pedidoXMetodoPago });
    } catch (error) {
        if (error.message === "PedidoXMetodoPago no encontrado") {
            res.status(404).json({ error: "PedidoXMetodoPago no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /pedidoXMetodoPago/{id}:
 *   delete:
 *     summary: Elimina un pedidoXMetodoPago por ID
 *     tags: [PedidoXMetodoPagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pedidoXMetodoPago
 *     responses:
 *       200:
 *         description: PedidoXMetodoPago eliminado exitosamente
 *       404:
 *         description: PedidoXMetodoPago no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pedidoXMetodoPagoService: PedidoXMetodoPagoService = req.scope.resolve("pedidoxmetodopagoService");
    const { id } = req.params;

    try {
        await pedidoXMetodoPagoService.eliminar(id);
        res.status(200).json({ message: "PedidoXMetodoPago eliminado exitosamente" });
    } catch (error) {
        res.status(404).json({ error: "PedidoXMetodoPago no encontrado" });
    }
};

export const AUTHENTICATE = false;