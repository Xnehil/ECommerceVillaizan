import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import PedidoService from "../../../../services/Pedido";
import { Pedido } from "src/models/Pedido";

/**
 * @swagger
 * /pedido/{id}:
 *   get:
 *     summary: Recupera un pedido por ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pedido
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
    const { id } = req.params;
    const enriquecido = req.query.enriquecido === 'true';
    try {
        const pedido = await pedidoService.recuperar(id,
            {
                skip: 0,
                take: 20,
                relations: enriquecido ? ["motorizado","direccion","usuario"] : []
            }
        );
        res.json({ pedido });
    } catch (error) {
        res.status(404).json({ error: "Pedido no encontrado" });
    }
};

/**
 * @swagger
 * /pedido/{id}:
 *   get:
 *     summary: Recupera un pedido por ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pedido
 *       - in: query
 *         name: enriquecido
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Si se debe recuperar el producto enriquecido
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

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pedidoService: PedidoService = req.scope.resolve("pedidoService");
    const { id } = req.params;
    const pedidoData = req.body as Partial<Pedido>;

    try {
        const pedido = await pedidoService.actualizar(id, pedidoData);
        res.json({ pedido });
    } catch (error) {
        console.log(error);
        if (error.message === "Pedido no encontrado") {
            res.status(404).json({ error: "Pedido no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /pedido/{id}:
 *   delete:
 *     summary: Elimina un pedido por ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Pedido eliminado exitosamente
 *       404:
 *         description: Pedido no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pedidoService: PedidoService = req.scope.resolve("pedidoService");
    const { id } = req.params;

    try {
        const pedido = await pedidoService.eliminar(id);
        res.status(200).json({ message: "Pedido eliminado exitosamente", pedido });
    } catch (error) {
        res.status(404).json({ error: "Pedido no encontrado" });
    }
};

export const AUTHENTICATE = false;