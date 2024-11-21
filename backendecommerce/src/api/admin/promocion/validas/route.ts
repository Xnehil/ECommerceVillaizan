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
 * /promocion/validas:
 *   get:
 *     summary: Retrieve valid promotions
 *     description: Fetches all valid promotions from the PromocionService.
 *     responses:
 *       200:
 *         description: A list of valid promotions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 promociones:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       // Define the properties of a promotion object here
 *       404:
 *         description: Promoción no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Promoción no encontrada
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const promocionService: PromocionService = req.scope.resolve("promocionService");

    try {
        const promociones = await promocionService.recuperarValidas();
        res.json({ promociones });
    } catch (error) {
        res.status(404).json({ error: "Promoción no encontrada" });
    }
};



export const AUTHENTICATE = false;