import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

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

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const pedidoService: PedidoService = req.scope.resolve("pedidoService");
    const { id } = req.params;
    const enriquecido = req.query.enriquecido === "true";
    try {
        const pedido = await pedidoService.recuperar(id, {
            relations: enriquecido
                ? ["motorizado", "direccion", "usuario", "pedidosXMetodoPago"]
                : [],
        });
        res.json({ pedido });
    } catch (error) {
        res.status(404).json({ error: "Pedido no encontrado" });
    }
};

/**
 * @swagger
 * /pedido/{id}:
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
 *       - in: query
 *         name: asignarRepartidor
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Si se debe asignar un repartidor
 *       - in: query
 *         name: confirmar
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Si se debe confirmar el pedido. No hace falta enviar el body
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       200:
 *         description: Pedido actualizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pedido'
 *       400:
 *         description: Petición inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Petición inválida
 *       404:
 *         description: Pedido no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Pedido no encontrado
 *       503:
 *         description: No hay motorizados disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No hay motorizados
 */

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const pedidoService: PedidoService = req.scope.resolve("pedidoService");
    const { id } = req.params;
    const pedidoData = req.body as Partial<Pedido>;
    const asignarRepartidor = req.query.asignarRepartidor === "true";
    const confirmar = req.query.confirmar === "true";

    if (confirmar) {
        try {
            const pedido = await pedidoService.confirmar(id);
            res.json({ pedido });
        } catch (error) {
            res.status(404).json({ error: "Pedido no encontrado" });
        }
        return;
    }

    try {
        const pedido = await pedidoService.actualizar(
            id,
            pedidoData,
            asignarRepartidor
        );
        res.json({ pedido });
    } catch (error) {
        // console.log(error);
        if (error.message === "Pedido no encontrado") {
            res.status(404).json({ error: "Pedido no encontrado" });
        } else if (error.message === "No hay motorizados disponibles") {
            res.status(503).json({ error: "No hay motorizados" });
        } else if (
            error.message ==
            "No hay motorizados disponibles con suficiente stock"
        ) {
            res.status(504).json({
                error: "No hay motorizados disponibles con suficiente stock",
            });
        } else {
            console.log(error);
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

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const pedidoService: PedidoService = req.scope.resolve("pedidoService");
    const { id } = req.params;

    try {
        const pedido = await pedidoService.eliminar(id);
        res.status(200).json({
            message: "Pedido eliminado exitosamente",
            pedido,
        });
    } catch (error) {
        res.status(404).json({ error: "Pedido no encontrado" });
    }
};

export const AUTHENTICATE = false;
