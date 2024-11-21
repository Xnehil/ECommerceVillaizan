import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  DetallePedidoService  from "../../../../services/DetallePedido"
import { DetallePedido } from "src/models/DetallePedido";
/**

/**
 * @swagger
 * /detallePedido/{id}:
 *   get:
 *     summary: Recupera un detallePedido por ID
 *     tags: [DetallePedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del detallePedido
 *     responses:
 *       200:
 *         description: Detalles del detallePedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DetallePedido'
 *       404:
 *         description: DetallePedido no encontrado
 */


export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const detallepedidoService: DetallePedidoService = req.scope.resolve("detallepedidoService");
    const id = req.params.id;

    try {
        const detallePedido = await detallepedidoService.recuperarEnriquecido(id);
        res.json({ detallePedido });
    } catch (error) {
        res.status(404).json({
            error: "detallePedido no encontrado",
            message: error.message
        });
    }
};

/**
 * @swagger
 * /detallePedido/{id}:
 *   put:
 *     summary: Actualiza un detallePedido por ID
 *     tags: [DetallePedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del detallePedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/detallePedido'
 *     responses:
 *       200:
 *         description: detallePedido actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/detallePedido'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: detallePedido no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const detallepedidoService: DetallePedidoService = req.scope.resolve("detallepedidoService");
    const id = req.params.id;
    const detallePedidoData = req.body as Partial<DetallePedido>;

    try {
        const detallePedido = await detallepedidoService.actualizar(id, detallePedidoData);
        res.json({ detallePedido });
    } catch (error) {
        if (error.message === "detallePedido no encontrado") {
            res.status(404).json({ error: "detallePedido no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /detallePedido/{id}:
 *   delete:
 *     summary: Elimina un detallePedido por ID
 *     tags: [DetallePedidos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del detallePedido
 *     responses:
 *       200:
 *         description: detallePedido eliminado exitosamente
 *       404:
 *         description: detallePedido no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const detallepedidoService: DetallePedidoService = req.scope.resolve("detallepedidoService");
    const id = req.params.id;

    try {
        await detallepedidoService.eliminar(id);
        res.status(200).json({ message: "detallePedido eliminado exitosamente" });
    } catch (error) {
        res.status(404).json({ error: "detallePedido no encontrado" });
    }
};

export const AUTHENTICATE = false
