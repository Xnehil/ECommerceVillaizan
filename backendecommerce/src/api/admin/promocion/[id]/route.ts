import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import PromocionService from "../../../../services/Promocion";
import { Promocion } from "src/models/Promocion";

/**
 * @swagger
 * tags:
 *   name: Promociones
 *   description: API para la gestión de promociones
 */

/**
 * @swagger
 * /promocion/{id}:
 *   get:
 *     summary: Recupera una promoción por ID
 *     tags: [Promociones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la promoción
 *     responses:
 *       200:
 *         description: Detalles de la promoción
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promocion'
 *       404:
 *         description: Promoción no encontrada
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const promocionService: PromocionService = req.scope.resolve("promocionService");
    const { id } = req.params;

    try {
        const promocion = await promocionService.recuperar(id);
        res.json({ promocion });
    } catch (error) {
        res.status(404).json({ error: "Promoción no encontrada" });
    }
};

/**
 * @swagger
 * /promocion/{id}:
 *   put:
 *     summary: Actualiza una promoción por ID
 *     tags: [Promociones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la promoción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promocion'
 *     responses:
 *       200:
 *         description: Promoción actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promocion'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Promoción no encontrada
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const promocionService: PromocionService = req.scope.resolve("promocionService");
    const { id } = req.params;
    const promocionData = req.body as Partial<Promocion>;

    try {
        const promocion = await promocionService.actualizar(id, promocionData);
        res.json({ promocion });
    } catch (error) {
        if (error.message === "Promoción no encontrada") {
            res.status(404).json({ error: "Promoción no encontrada" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /promocion/{id}:
 *   delete:
 *     summary: Elimina una promoción por ID
 *     tags: [Promociones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la promoción
 *     responses:
 *       200:
 *         description: Promoción eliminada exitosamente
 *       404:
 *         description: Promoción no encontrada
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const promocionService: PromocionService = req.scope.resolve("promocionService");
    const { id } = req.params;

    try {
        await promocionService.eliminar(id);
        res.status(200).json({ message: "Promoción eliminada exitosamente" });
    } catch (error) {
        res.status(404).json({ error: "Promoción no encontrada" });
    }
};

/**
 * @swagger
 * /promocion/{id}:
 *   patch:
 *     summary: Actualiza el stock de una promoción
 *     tags: [Promociones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la promoción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: number
 *                 description: Cantidad a modificar
 *               operacion:
 *                 type: string
 *                 enum: ["+", "-"]
 *                 description: Operación a realizar
 *     responses:
 *       200:
 *         description: Stock actualizado exitosamente
 *       400:
 *         description: Operación inválida
 *       404:
 *         description: Promoción no encontrada
 */

export const PATCH = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const promocionService: PromocionService = req.scope.resolve("promocionService");
    const { id } = req.params;
    const { cantidad, operacion } = req.body as { cantidad: number; operacion: "+" | "-" };
  
    try {
      const updatedPromocion = await promocionService.actualizarStock(id, cantidad, operacion);
      return res.status(200).json({ promocion: updatedPromocion });
    } catch (error) {
      return res.status(500).json({ message: "Error al actualizar el stock", error });
    }
  };

export const AUTHENTICATE = false;