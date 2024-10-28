import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa"

import CiudadService from "../../../../services/Ciudad"
import { Ciudad } from "src/models/Ciudad";

/**
 * @swagger
 * /ciudad/{id}:
 *   get:
 *     summary: Recupera un Ciudad por ID
 *     tags: [Ciudades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del Ciudad
 *     responses:
 *       200:
 *         description: Detalles del Ciudad
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ciudad'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ciudadService: CiudadService = req.scope.resolve("ciudadService");
    const id = req.params.id;

    try {
        const ciudad = await ciudadService.recuperar(id);
        res.json({ ciudad });
    } catch (error) {
        res.status(404).json({ error: "ciudad no encontrada" });
    }
};

/**
 * @swagger
 * /ciudad/{id}:
 *   put:
 *     summary: Actualiza un Ciudad por ID
 *     tags: [Ciudades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del Ciudad
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Ciudad'
 *     responses:
 *       200:
 *         description: Ciudad actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ciudad'
 *       400:
 *         description: Ciudad inválida
 *       404:
 *         description: Ciudad no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ciudadService: CiudadService = req.scope.resolve("ciudadService");
    const id = req.params.id;
    const ciudadData = req.body as Partial<Ciudad>;

    try {
        const ciudad = await ciudadService.actualizar(id, ciudadData);
        res.json({ ciudad });
    } catch (error) {
        if (error.message === "ciudad no encontrada") {
            res.status(404).json({ error: "ciudad no encontrada" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /ciudad/{id}:
 *   delete:
 *     summary: Elimina un ciudad por ID
 *     tags: [Ciudades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del ciudad
 *     responses:
 *       200:
 *         description: Ciudad eliminado exitosamente
 *       404:
 *         description: Ciudad no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ciudadService: CiudadService = req.scope.resolve("ciudadService");
    const id = req.params.id;

    try {
        await ciudadService.eliminar(id);
        res.status(200).json({ message: "ciudad eliminado exitosamente" });
    } catch (error) {
        res.status(404).json({ error: "ciudad no encontrada" });
    }
};

export const AUTHENTICATE = false;