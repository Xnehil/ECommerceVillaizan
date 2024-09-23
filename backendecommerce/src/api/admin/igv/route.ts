import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import IgvService from "../../../services/Igv";
import { Igv } from "src/models/Igv";

/**
 * @swagger
 * tags:
 *   name: Igvs
 *   description: API para la gestión de IGVs
 */

/**
 * @swagger
 * /igvs:
 *   get:
 *     summary: Lista todos los IGVs con paginación
 *     tags: [Igvs]
 *     responses:
 *       200:
 *         description: Una lista de IGVs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 igvs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Igv'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const igvService: IgvService = req.scope.resolve("igvService");

    res.json({
        igvs: await igvService.listarConPaginacion(),
    });
};

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const igvService: IgvService = req.scope.resolve("igvService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const igvData = req.body as Igv;
    const igv = await igvService.crear(igvData);

    res.json({
        igv,
    });
};

export const AUTHENTICATE = false;
