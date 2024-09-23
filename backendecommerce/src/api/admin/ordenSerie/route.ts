import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import OrdenSerieService from "../../../services/OrdenSerie";
import { OrdenSerie } from "src/models/OrdenSerie";

/**
 * @swagger
 * tags:
 *   name: OrdenSeries
 *   description: API para la gestión de series de órdenes
 */

/**
 * @swagger
 * /ordenseries:
 *   get:
 *     summary: Lista todas las series de órdenes con paginación
 *     tags: [OrdenSeries]
 *     responses:
 *       200:
 *         description: Una lista de series de órdenes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ordenseries:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/OrdenSerie'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ordenSerieService: OrdenSerieService = req.scope.resolve("ordenserieService");

    res.json({
        ordenSeries: await ordenSerieService.listarConPaginacion(),
    });
};

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ordenSerieService: OrdenSerieService = req.scope.resolve("ordenserieService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const ordenSerieData = req.body as OrdenSerie;
    const ordenSerie = await ordenSerieService.crear(ordenSerieData);

    res.json({
        ordenSerie,
    });
};

export const AUTHENTICATE = false;
