import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import VentaService from "../../../services/Venta";
import { Venta } from "src/models/Venta";

/**
 * @swagger
 * tags:
 *   name: Ventas
 *   description: API para la gestión de ventas
 */

/**
 * @swagger
 * /venta:
 *   get:
 *     summary: Lista todas las ventas con paginación
 *     tags: [Ventas]
 *     parameters:
 *       - in: query
 *         name: buscarPor
 *         schema:
 *           type: string
 *           enum: [motorizado, cliente]
 *         required: false
 *         description: Filtrar por motorizado o cliente
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: false
 *         description: ID del motorizado o cliente
 *     responses:
 *       200:
 *         description: Una lista de ventas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ventas:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Venta'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ventaService: VentaService = req.scope.resolve("ventaService");
    const { buscarPor, id } = req.query;

    let filter = {};

    if (buscarPor === "motorizado" && id) {
        filter = { motorizadoId: id };
    } else if (buscarPor === "cliente" && id) {
        filter = { clienteId: id };
    }
    let config = {
        relations: ["pedido"],
    };
    res.json({
        ventas: await ventaService.listarConPaginacion(filter, config),
    });
};

/**
 * @swagger
 * /venta:
 *   post:
 *     summary: Crea una nueva venta
 *     tags: [Venta]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Venta'
 *     responses:
 *       201:
 *         description: La venta ha sido creada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venta'
 *       400:
 *         description: Petición inválida
 */

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ventaService: VentaService = req.scope.resolve("ventaService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const ventaData = req.body as Venta;
    const venta = await ventaService.crear(ventaData);

    res.json({
        venta,
    });
};


export const AUTHENTICATE = false;
