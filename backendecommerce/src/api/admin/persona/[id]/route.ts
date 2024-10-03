import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import PersonaService from "../../../../services/Persona";
import { Persona } from "src/models/Persona";

/**
 * @swagger
 * tags:
 *   name: Personas
 *   description: API para la gestión de personas
 */


/**
 * @swagger
 * /persona/{id}:
 *   get:
 *     summary: Recupera una persona por ID
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la persona
 *     responses:
 *       200:
 *         description: Detalles de la persona
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Persona'
 *       404:
 *         description: Persona no encontrada
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const personaService: PersonaService = req.scope.resolve("personaService");
    const { id } = req.params;

    try {
        const persona = await personaService.recuperar(id);
        res.json({ persona });
    } catch (error) {
        res.status(404).json({ error: "Persona no encontrada" });
    }
};

/**
 * @swagger
 * /persona/{id}:
 *   put:
 *     summary: Actualiza una persona por ID
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la persona
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Persona'
 *     responses:
 *       200:
 *         description: Persona actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Persona'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Persona no encontrada
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const personaService: PersonaService = req.scope.resolve("personaService");
    const { id } = req.params;
    const personaData = req.body as Partial<Persona>;

    try {
        const persona = await personaService.actualizar(id, personaData);
        res.json({ persona });
    } catch (error) {
        if (error.message === "Persona no encontrada") {
            res.status(404).json({ error: "Persona no encontrada" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /persona/{id}:
 *   delete:
 *     summary: Elimina una persona por ID
 *     tags: [Personas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la persona
 *     responses:
 *       200:
 *         description: Persona eliminada exitosamente
 *       404:
 *         description: Persona no encontrada
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const personaService: PersonaService = req.scope.resolve("personaService");
    const { id } = req.params;

    try {
        const persona = await personaService.eliminar(id);
        res.status(200).json({ message: "Persona eliminada exitosamente", persona });
    } catch (error) {
        res.status(404).json({ error: "Persona no encontrada" });
    }
};

export const AUTHENTICATE = false;