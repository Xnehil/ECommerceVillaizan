import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

import PlantillaService from "@services/Plantilla";
import { Plantilla } from "src/models/Plantilla";
/**

/**
 * @swagger
 * /plantilla/{id}:
 *   get:
 *     summary: Recupera un plantilla por ID
 *     tags: 
 *       - Plantillas
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del plantilla
 *     responses:
 *       200:
 *         description: Detalles del plantilla
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plantilla'
 *       404:
 *         description: Plantilla no encontrado
 */

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
    const plantillaService: PlantillaService =
        req.scope.resolve("plantillaService");
    const id = req.params.id;

    try {
        const plantilla = await plantillaService.recuperar(id);
        res.json({ plantilla });
    } catch (error) {
        console.log("Error: ", error.message);
        res.status(404).json({ error: "plantilla no encontrado" });
    }
};

/**
 * @swagger
 * /plantilla/{id}:
 *   put:
 *     summary: Actualiza un plantilla por ID
 *     tags: [Plantillas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del plantilla
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Plantilla'
 *     responses:
 *       200:
 *         description: plantilla actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Plantilla'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: plantilla no encontrado
 */

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
    const plantillaService: PlantillaService =
        req.scope.resolve("plantillaService");
    const id = req.params.id;
    const plantillaData = req.body as Partial<Plantilla>;

    try {
        const plantilla = await plantillaService.actualizar(id, plantillaData);
        res.json({ plantilla });
    } catch (error) {
        console.log("Error: ", error.message);  
        res.status(400).json({ error: "Petición inválida" });
    }
};

/**
 * @swagger
 * /plantilla/{id}:
 *   delete:
 *     summary: Elimina un plantilla por ID
 *     tags:
 *       - Plantillas
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del plantilla
 *     responses:
 *       200:
 *         description: plantilla eliminado exitosamente
 *       404:
 *         description: plantilla no encontrado
 */

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
    const plantillaService: PlantillaService =
        req.scope.resolve("plantillaService");
    const id = req.params.id;

    try {
        await plantillaService.eliminar(id);
        res.status(200).json({ message: "plantilla eliminada exitosamente" });
    } catch (error) {
        console.log("Error: ", error.message);
        return res.status(404).json({ error: "plantilla no encontrado" });
    }
};

export const AUTHENTICATE = false;
