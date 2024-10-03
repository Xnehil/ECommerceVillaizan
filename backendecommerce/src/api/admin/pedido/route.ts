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
 * /pedido:
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


export const AUTHENTICATE = false;
