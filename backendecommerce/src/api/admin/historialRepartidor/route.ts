import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import HistorialRepartidorService from "../../../services/HistorialRepartidor";
import { HistorialRepartidor } from "src/models/HistorialRepartidor";

/**
 * @swagger
 * tags:
 *   name: HistorialRepartidores
 *   description: API para la gestión de Historiales de Repartidores
 */

/**
 * @swagger
 * /historialRepartidor:
 *   get:
 *     summary: Lista todos los Historiales de Repartidores con paginación
 *     tags: [HistorialRepartidores]
 *     responses:
 *       200:
 *         description: Una lista de Historiales de Repartidores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 historiales:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HistorialRepartidor'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const historialRepartidorService: HistorialRepartidorService = req.scope.resolve("historialrepartidorService");

    res.json({
        historiales: await historialRepartidorService.listarConPaginacion(),
    });
};

/**
 * @swagger
 * /historialRepartidor:
 *   post:
 *     summary: Crea un nuevo Historial de Repartidor
 *     tags: [HistorialRepartidor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HistorialRepartidor'
 *     responses:
 *       201:
 *         description: El Historial de Repartidor ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HistorialRepartidor'
 *       400:
 *         description: Petición inválida
 */

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const historialRepartidorService: HistorialRepartidorService = req.scope.resolve("historialRepartidorService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const historialData = req.body as HistorialRepartidor;
    const historial = await historialRepartidorService.crear(historialData);

    res.json({
        historial,
    });
};


export const AUTHENTICATE = false;