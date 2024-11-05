import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import PromocionService from "../../../services/Promocion";
import { Promocion } from "src/models/Promocion";

/**
 * @swagger
 * tags:
 *   name: Promociones
 *   description: API para la gestión de promociones
 */

/**
 * @swagger
 * /promocion:
 *   get:
 *     summary: Lista todas las promociones con paginación
 *     tags: [Promociones]
 *     responses:
 *       200:
 *         description: Una lista de promociones
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 promociones:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Promocion'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const promocionService: PromocionService = req.scope.resolve("promocionService");

    res.json({
        promociones: await promocionService.listarConPaginacion(),
    });
};

/**
 * @swagger
 * /promocion:
 *   post:
 *     summary: Crea una nueva promoción
 *     tags: [Promociones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Promocion'
 *     responses:
 *       201:
 *         description: La promoción ha sido creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Promocion'
 *       400:
 *         description: Petición inválida
 */

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const promocionService: PromocionService = req.scope.resolve("promocionService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const promocionData = req.body as Promocion;
    const promocion = await promocionService.crear(promocionData);

    res.json({
        promocion,
    });
};

export const AUTHENTICATE = false;