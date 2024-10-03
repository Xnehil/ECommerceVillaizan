import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import OrdenSerieService from "../../../../services/OrdenSerie";
import { OrdenSerie } from "src/models/OrdenSerie";

/**
 * @swagger
 * tags:
 *   name: OrdenSeries
 *   description: API para la gestión de series de órdenes
 */

/**
 * @swagger
 * /ordenSerie/{id}:
 *   get:
 *     summary: Recupera una serie de órdenes por ID
 *     tags: [OrdenSeries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la serie de órdenes
 *     responses:
 *       200:
 *         description: Detalles de la serie de órdenes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenSerie'
 *       404:
 *         description: Serie de órdenes no encontrada
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ordenSerieService: OrdenSerieService = req.scope.resolve("ordenserieService");
    const { id } = req.params;

    try {
        const ordenSerie = await ordenSerieService.recuperar(id);
        res.json({ ordenSerie });
    } catch (error) {
        res.status(404).json({ error: "Serie de órdenes no encontrada" });
    }
};

/**
 * @swagger
 * /ordenSerie/{id}:
 *   put:
 *     summary: Actualiza una serie de órdenes por ID
 *     tags: [OrdenSeries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la serie de órdenes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrdenSerie'
 *     responses:
 *       200:
 *         description: Serie de órdenes actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrdenSerie'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Serie de órdenes no encontrada
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ordenSerieService: OrdenSerieService = req.scope.resolve("ordenserieService");
    const { id } = req.params;
    const ordenSerieData = req.body as Partial<OrdenSerie>;

    try {
        const ordenSerie = await ordenSerieService.actualizar(id, ordenSerieData);
        res.json({ ordenSerie });
    } catch (error) {
        if (error.message === "Serie de órdenes no encontrada") {
            res.status(404).json({ error: "Serie de órdenes no encontrada" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /ordenSerie/{id}:
 *   delete:
 *     summary: Elimina una serie de órdenes por ID
 *     tags: [OrdenSeries]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la serie de órdenes
 *     responses:
 *       200:
 *         description: Serie de órdenes eliminada exitosamente
 *       404:
 *         description: Serie de órdenes no encontrada
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ordenSerieService: OrdenSerieService = req.scope.resolve("ordenserieService");
    const { id } = req.params;

    try {
        const ordenSerie = await ordenSerieService.eliminar(id);
        res.status(200).json({ message: "Serie de órdenes eliminada exitosamente", ordenSerie });
    } catch (error) {
        res.status(404).json({ error: "Serie de órdenes no encontrada" });
    }
};


export const AUTHENTICATE = false;
