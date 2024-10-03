import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import BancoService from "../../../services/Banco";
import { Banco } from "src/models/Banco";

/**
 * @swagger
 * tags:
 *   name: Bancos
 *   description: API para la gestión de bancos
 */

/**
 * @swagger
 * /banco:
 *   get:
 *     summary: Lista todos los bancos con paginación
 *     tags: [Bancos]
 *     responses:
 *       200:
 *         description: Una lista de bancos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 bancos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Banco'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const bancoService: BancoService = req.scope.resolve("bancoService");

    res.json({
        bancos: await bancoService.listarConPaginacion(),
    });
};

/**
 * @swagger
 * /banco:
 *   post:
 *     summary: Crea un nuevo banco
 *     tags: [Bancos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Banco'
 *     responses:
 *       201:
 *         description: El banco ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Banco'
 *       400:
 *         description: Petición inválida
 */

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const bancoService: BancoService = req.scope.resolve("bancoService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const bancoData = req.body as Banco;
    const banco = await bancoService.crear(bancoData);

    res.json({
        banco,
    });
};



export const AUTHENTICATE = false;
