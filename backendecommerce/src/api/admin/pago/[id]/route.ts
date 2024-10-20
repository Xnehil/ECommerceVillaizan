import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import PagoService from "../../../../services/Pago";
import { Pago } from "src/models/Pago";

/**
 * @swagger
 * tags:
 *   name: Pagos
 *   description: API para la gestión de pagos
 */

/**
 * @swagger
 * /pago/{id}:
 *   get:
 *     summary: Recupera un pago por ID
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pago
 *     responses:
 *       200:
 *         description: Detalles del pago
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       404:
 *         description: Pago no encontrado
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pagoService: PagoService = req.scope.resolve("pagoService");
    const { id } = req.params;

    try {
        const pago = await pagoService.recuperar(id);
        res.json({ pago });
    } catch (error) {
        res.status(404).json({ error: "Pago no encontrado" });
    }
};

/**
 * @swagger
 * /pago/{id}:
 *   put:
 *     summary: Actualiza un pago por ID
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pago'
 *     responses:
 *       200:
 *         description: Pago actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pago'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Pago no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pagoService: PagoService = req.scope.resolve("pagoService");
    const { id } = req.params;
    const pagoData = req.body as Partial<Pago>;

    try {
        const pago = await pagoService.actualizar(id, pagoData);
        res.json({ pago });
    } catch (error) {
        if (error.message === "Pago no encontrado") {
            res.status(404).json({ error: "Pago no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /pago/{id}:
 *   delete:
 *     summary: Elimina un pago por ID
 *     tags: [Pagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del pago
 *     responses:
 *       200:
 *         description: Pago eliminado exitosamente
 *       404:
 *         description: Pago no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const pagoService: PagoService = req.scope.resolve("pagoService");
    const { id } = req.params;

    try {
        const pago = await pagoService.eliminar(id);
        res.status(200).json({ message: "Pago eliminado exitosamente", pago });
    } catch (error) {
        res.status(404).json({ error: "Pago no encontrado" });
    }
};

export const AUTHENTICATE = false;