import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import HistorialRepartidorService from "../../../../services/HistorialRepartidor";
import { HistorialRepartidor } from "src/models/HistorialRepartidor";

/**
 * @swagger
 * tags:
 *   name: HistorialRepartidores
 *   description: API para la gestión de Historiales de Repartidores
 */


/**
 * @swagger
 * /historialRepartidor/{id}:
 *   get:
 *     summary: Recupera un Historial de Repartidor por ID
 *     tags: [HistorialRepartidores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del Historial de Repartidor
 *     responses:
 *       200:
 *         description: Detalles del Historial de Repartidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistorialRepartidor'
 *       404:
 *         description: Historial de Repartidor no encontrado
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const historialRepartidorService: HistorialRepartidorService = req.scope.resolve("historialRepartidorService");
    const { id } = req.params;

    try {
        const historial = await historialRepartidorService.recuperar(id);
        res.json({ historial });
    } catch (error) {
        res.status(404).json({ error: "Historial de Repartidor no encontrado" });
    }
};

/**
 * @swagger
 * /historialRepartidor/{id}:
 *   put:
 *     summary: Actualiza un Historial de Repartidor por ID
 *     tags: [HistorialRepartidores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del Historial de Repartidor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistorialRepartidor'
 *     responses:
 *       200:
 *         description: Historial de Repartidor actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistorialRepartidor'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Historial de Repartidor no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const historialRepartidorService: HistorialRepartidorService = req.scope.resolve("historialRepartidorService");
    const { id } = req.params;
    const historialData = req.body as Partial<HistorialRepartidor>;

    try {
        const historial = await historialRepartidorService.actualizar(id, historialData);
        res.json({ historial });
    } catch (error) {
        if (error.message === "Historial de Repartidor no encontrado") {
            res.status(404).json({ error: "Historial de Repartidor no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /historialRepartidor/{id}:
 *   delete:
 *     summary: Elimina un Historial de Repartidor por ID
 *     tags: [HistorialRepartidores]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del Historial de Repartidor
 *     responses:
 *       200:
 *         description: Historial de Repartidor eliminado exitosamente
 *       404:
 *         description: Historial de Repartidor no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const historialRepartidorService: HistorialRepartidorService = req.scope.resolve("historialRepartidorService");
    const { id } = req.params;

    try {
        const historial = await historialRepartidorService.eliminar(id);
        res.status(200).json({ message: "Historial de Repartidor eliminado exitosamente", historial });
    } catch (error) {
        res.status(404).json({ error: "Historial de Repartidor no encontrado" });
    }
};

export const AUTHENTICATE = false;