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

/**
 * @swagger
 * /pedido:
 *   post:
 *     summary: Crea un nuevo pedido
 *     tags: [Pedido]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: El pedido ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Petición inválida
 */

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

/**
 * @swagger
 * /pedidos/{id}:
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

export const GET_BY_ID = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pedidoService: PedidoService = req.scope.resolve("pedidoService");
    const { id } = req.params;

    try {
        const pedido = await pedidoService.recuperar(id);
        res.json({ pedido });
    } catch (error) {
        res.status(404).json({ error: "Pedido no encontrado" });
    }
};

/**
 * @swagger
 * /pedidos/{id}:
 *   put:
 *     summary: Actualiza un pedido por ID
 *     tags: [Pedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       200:
 *         description: Pedido actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Petición inválida
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
        if (error.message === "Pedido no encontrado") {
            res.status(404).json({ error: "Pedido no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /pedidos/{id}:
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
