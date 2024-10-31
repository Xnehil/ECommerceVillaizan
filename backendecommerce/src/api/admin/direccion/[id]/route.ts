import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa"

import DireccionService from "../../../../services/Direccion"
import { Direccion } from "src/models/Direccion";

/**
 * @swagger
 * /direccion/{id}:
 *   get:
 *     summary: Recupera un Direccion por ID
 *     tags: [Direcciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del Direccion
 *     responses:
 *       200:
 *         description: Detalles del Direccion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Direccion'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const direccionService: DireccionService = req.scope.resolve("direccionService");
    const id = req.params.id;

    try {
        const direccion = await direccionService.recuperar(id);
        res.json({ direccion });
    } catch (error) {
        res.status(404).json({ error: "direccion no encontrada" });
    }
};

/**
 * @swagger
 * /direccion/{id}:
 *   put:
 *     summary: Actualiza un Direccion por ID
 *     tags: [Direcciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del Direccion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Direccion'
 *     responses:
 *       200:
 *         description: Direccion actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Direccion'
 *       400:
 *         description: Direccion inválida
 *       404:
 *         description: Direccion no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const direccionService: DireccionService = req.scope.resolve("direccionService");
    const id = req.params.id;
    const direccionData = req.body as Partial<Direccion>;

    try {
        const direccion = await direccionService.actualizar(id, direccionData);
        res.json({ direccion });
    } catch (error) {
        if (error.message === "direccion no encontrada") {
            res.status(404).json({ error: "direccion no encontrada" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /direccion/{id}:
 *   delete:
 *     summary: Elimina un direccion por ID
 *     tags: [Direcciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del direccion
 *     responses:
 *       200:
 *         description: Direccion eliminado exitosamente
 *       404:
 *         description: Direccion no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const direccionService: DireccionService = req.scope.resolve("direccionService");
    const id = req.params.id;

    try {
        await direccionService.eliminar(id);
        res.status(200).json({ message: "direccion eliminado exitosamente" });
    } catch (error) {
        res.status(404).json({ error: "direccion no encontrada" });
    }
};

export const AUTHENTICATE = false;