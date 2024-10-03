import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import VentaService from "../../../../services/Venta";
import { Venta } from "src/models/Venta";

/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: API para la gestión de ventas
 */

/**
 * @swagger
 * /venta/{id}:
 *   get:
 *     summary: Recupera una venta por ID
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Detalles de la venta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venta'
 *       404:
 *         description: Venta no encontrada
 */

export const GET_BY_ID = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ventaService: VentaService = req.scope.resolve("ventaService");
    const { id } = req.params;

    try {
        const venta = await ventaService.recuperar(id);
        res.json({ venta });
    } catch (error) {
        res.status(404).json({ error: "Venta no encontrada" });
    }
};

/**
 * @swagger
 * /venta/{id}:
 *   put:
 *     summary: Actualiza una venta por ID
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la venta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Venta'
 *     responses:
 *       200:
 *         description: Venta actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venta'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Venta no encontrada
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ventaService: VentaService = req.scope.resolve("ventaService");
    const { id } = req.params;
    const ventaData = req.body as Partial<Venta>;

    try {
        const venta = await ventaService.actualizar(id, ventaData);
        res.json({ venta });
    } catch (error) {
        if (error.message === "Venta no encontrada") {
            res.status(404).json({ error: "Venta no encontrada" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /venta/{id}:
 *   delete:
 *     summary: Elimina una venta por ID
 *     tags: [Ventas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta eliminada exitosamente
 *       404:
 *         description: Venta no encontrada
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ventaService: VentaService = req.scope.resolve("ventaService");
    const { id } = req.params;

    try {
        const venta = await ventaService.eliminar(id);
        res.status(200).json({ message: "Venta eliminada exitosamente", venta });
    } catch (error) {
        res.status(404).json({ error: "Venta no encontrada" });
    }
};

export const AUTHENTICATE = false;
