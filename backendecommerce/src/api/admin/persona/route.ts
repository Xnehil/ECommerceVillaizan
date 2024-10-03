import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import PersonaService from "../../../services/Persona";
import { Persona } from "src/models/Persona";

/**
 * @swagger
 * tags:
 *   name: Personas
 *   description: API para la gestión de personas
 */

/**
 * @swagger
 * /persona:
 *   get:
 *     summary: Lista todas las personas con paginación
 *     tags: [Personas]
 *     responses:
 *       200:
 *         description: Una lista de personas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Persona'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const personaService: PersonaService = req.scope.resolve("personaService");

    res.json({
        personas: await personaService.listarConPaginacion(),
    });
};

/**
 * @swagger
 * /persona:
 *   post:
 *     summary: Crea una nueva persona
 *     tags: [Persona]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Persona'
 *     responses:
 *       201:
 *         description: La persona ha sido creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Persona'
 *       400:
 *         description: Petición inválida
 */

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const personaService: PersonaService = req.scope.resolve("personaService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const personaData = req.body as Persona;
    const persona = await personaService.crear(personaData);

    res.json({
        persona,
    });
};



export const AUTHENTICATE = false;
