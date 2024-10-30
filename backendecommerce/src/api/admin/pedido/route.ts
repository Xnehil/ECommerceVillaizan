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
 *     parameters:
 *       - in: query
 *         name: enriquecido
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Si se debe recuperar el producto enriquecido
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         required: false
 *         description: El estado del pedido (carrito, solicitado, verificado, enProgreso, entregado, cancelado, noCarrito)
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
    const enriquecido = req.query.enriquecido === 'true';
    const estado = req.query.estado as string;

    const validEstados = ['carrito', 'solicitado', 'verificado', 'enProgreso', 'entregado', 'cancelado', 'noCarrito'];
    const filter: { estado?: string | string[] } = {};

    if (validEstados.includes(estado)) {
        if (estado === 'noCarrito') {
            filter.estado = '!= carrito'; 
        } else {
            filter.estado = estado;
        }
    }
    // console.log(filter);
    res.json({
        pedidos: await pedidoService.listarConPaginacion(
            filter,
            {
                relations: enriquecido ? ["motorizado", "direccion", "direccion.ciudad", "usuario"] : []
            }
        ),
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
