import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import MetodoPagoService from "../../../../services/MetodoPago";
import { MetodoPago } from "src/models/MetodoPago";

/**
 * @swagger
 * tags:
 *   name: MetodoPagos
 *   description: API para la gestión de métodos de pago
 */

/**
 * @swagger
 * /metodoPago/{id}:
 *   get:
 *     summary: Recupera un método de pago por ID
 *     tags: [MetodoPagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del método de pago
 *     responses:
 *       200:
 *         description: Detalles del método de pago
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MetodoPago'
 *       404:
 *         description: Método de pago no encontrado
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const metodoPagoService: MetodoPagoService = req.scope.resolve("metodopagoService");
    const { id } = req.params;

    try {
        const metodoPago = await metodoPagoService.recuperar(id);
        res.json({ metodoPago });
    } catch (error) {
        res.status(404).json({ error: "Método de pago no encontrado" });
    }
};

/**
 * @swagger
 * /metodoPago/{id}:
 *   put:
 *     summary: Actualiza un método de pago por ID
 *     tags: [MetodoPagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del método de pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MetodoPago'
 *     responses:
 *       200:
 *         description: Método de pago actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MetodoPago'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Método de pago no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const metodoPagoService: MetodoPagoService = req.scope.resolve("metodopagoService");
    const { id } = req.params;
    const metodoPagoData = req.body as Partial<MetodoPago>;

    try {
        const metodoPago = await metodoPagoService.actualizar(id, metodoPagoData);
        res.json({ metodoPago });
    } catch (error) {
        if (error.message === "Método de pago no encontrado") {
            res.status(404).json({ error: "Método de pago no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /metodoPago/{id}:
 *   delete:
 *     summary: Elimina un método de pago por ID
 *     tags: [MetodoPagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del método de pago
 *     responses:
 *       200:
 *         description: Método de pago eliminado exitosamente
 *       404:
 *         description: Método de pago no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const metodoPagoService: MetodoPagoService = req.scope.resolve("metodopagoService");
    const { id } = req.params;

    try {
        await metodoPagoService.eliminar(id);
        res.status(200).json({ message: "Método de pago eliminado exitosamente" });
    } catch (error) {
        res.status(404).json({ error: "Método de pago no encontrado" });
    }
};


export const AUTHENTICATE = false;