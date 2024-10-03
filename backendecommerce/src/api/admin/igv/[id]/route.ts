import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import IgvService from "../../../../services/Igv";
import { Igv } from "src/models/Igv";

/**
 * @swagger
 * tags:
 *   name: Igvs
 *   description: API para la gestión de IGVs
 */


/**
 * @swagger
 * /igv/{id}:
 *   get:
 *     summary: Recupera un IGV por ID
 *     tags: [Igvs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del IGV
 *     responses:
 *       200:
 *         description: Detalles del IGV
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Igv'
 *       404:
 *         description: IGV no encontrado
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const igvService: IgvService = req.scope.resolve("igvService");
    const { id } = req.params;

    try {
        const igv = await igvService.recuperar(id);
        res.json({ igv });
    } catch (error) {
        res.status(404).json({ error: "IGV no encontrado" });
    }
};

/**
 * @swagger
 * /igv/{id}:
 *   put:
 *     summary: Actualiza un IGV por ID
 *     tags: [Igvs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del IGV
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Igv'
 *     responses:
 *       200:
 *         description: IGV actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Igv'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: IGV no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const igvService: IgvService = req.scope.resolve("igvService");
    const { id } = req.params;
    const igvData = req.body as Partial<Igv>;

    try {
        const igv = await igvService.actualizar(id, igvData);
        res.json({ igv });
    } catch (error) {
        if (error.message === "IGV no encontrado") {
            res.status(404).json({ error: "IGV no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /igv/{id}:
 *   delete:
 *     summary: Elimina un IGV por ID
 *     tags: [Igvs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del IGV
 *     responses:
 *       200:
 *         description: IGV eliminado exitosamente
 *       404:
 *         description: IGV no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const igvService: IgvService = req.scope.resolve("igvService");
    const { id } = req.params;

    try {
        const igv = await igvService.eliminar(id);
        res.status(200).json({ message: "IGV eliminado exitosamente", igv });
    } catch (error) {
        res.status(404).json({ error: "IGV no encontrado" });
    }
};

export const AUTHENTICATE = false;