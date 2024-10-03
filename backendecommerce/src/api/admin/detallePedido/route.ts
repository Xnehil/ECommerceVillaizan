import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import DetallePedidoService from "@services/DetallePedido";
import { DetallePedido } from "src/models/DetallePedido";

/**
 * @swagger
 * tags:
 *   name: DetallePedidos
 *   description: API para la gestión de detalle de pedidos
 */

/**
 * @swagger
 * /detallePedido:
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

/**
 * @swagger
 * /detallePedido:
 *   post:
 *     summary: Crea un nuevo detalle de pedido
 *     tags: [DetallesPedido]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetallePedido'
 *     responses:
 *       201:
 *         description: El detalle de pedido ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetallePedido'
 *       400:
 *         description: Petición inválida
 */

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

/**
 * @swagger
 * /detallePedido/{id}:
 *   get:
 *     summary: Recupera un detalle de pedido por ID
 *     tags: [DetallePedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del detalle de pedido
 *     responses:
 *       200:
 *         description: Detalles del pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetallePedido'
 *       404:
 *         description: Detalle de pedido no encontrado
 */

export const GET_BY_ID = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const detallePedidoService: DetallePedidoService = req.scope.resolve("detallepedidoService");
    const { id } = req.params;

    try {
        const detallePedido = await detallePedidoService.recuperar(id);
        res.json({ detallePedido });
    } catch (error) {
        res.status(404).json({ error: "Detalle de pedido no encontrado" });
    }
};

/**
 * @swagger
 * /detallePedido/{id}:
 *   put:
 *     summary: Actualiza un detalle de pedido por ID
 *     tags: [DetallePedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del detalle de pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DetallePedido'
 *     responses:
 *       200:
 *         description: Detalle de pedido actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetallePedido'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Detalle de pedido no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const detallePedidoService: DetallePedidoService = req.scope.resolve("detallepedidoService");
    const { id } = req.params;
    const detallePedidoData = req.body as Partial<DetallePedido>;

    try {
        const detallePedido = await detallePedidoService.actualizar(id, detallePedidoData);
        res.json({ detallePedido });
    } catch (error) {
        if (error.message === "Detalle de pedido no encontrado") {
            res.status(404).json({ error: "Detalle de pedido no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /detallePedido/{id}:
 *   delete:
 *     summary: Elimina un detalle de pedido por ID
 *     tags: [DetallePedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del detalle de pedido
 *     responses:
 *       200:
 *         description: Detalle de pedido eliminado exitosamente
 *       404:
 *         description: Detalle de pedido no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const detallePedidoService: DetallePedidoService = req.scope.resolve("detallepedidoService");
    const { id } = req.params;

    try {
        const detallePedido = await detallePedidoService.eliminar(id);
        res.status(200).json({ message: "Detalle de pedido eliminado exitosamente", detallePedido });
    } catch (error) {
        res.status(404).json({ error: "Detalle de pedido no encontrado" });
    }
};

export const AUTHENTICATE = false;
