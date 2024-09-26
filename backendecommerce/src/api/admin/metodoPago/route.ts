import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import MetodoPagoService from "../../../services/MetodoPago";
import { MetodoPago } from "src/models/MetodoPago";

/**
 * @swagger
 * tags:
 *   name: MetodoPagos
 *   description: API para la gestión de métodos de pago
 */

/**
 * @swagger
 * /metodopagos:
 *   get:
 *     summary: Lista todos los métodos de pago con paginación
 *     tags: [MetodoPagos]
 *     responses:
 *       200:
 *         description: Una lista de métodos de pago
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 metodopagos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MetodoPago'
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const metodoPagoService: MetodoPagoService = req.scope.resolve("metodopagoService");

    res.json({
        metodoPagos: await metodoPagoService.listarConPaginacion(),
    });
};
/**
 * @swagger
 * /metodo-pago:
 *   post:
 *     summary: Crea un nuevo método de pago
 *     tags: [MetodoPago]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MetodoPago'
 *     responses:
 *       201:
 *         description: El método de pago ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MetodoPago'
 *       400:
 *         description: Petición inválida
 */
export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const metodoPagoService: MetodoPagoService = req.scope.resolve("metodopagoService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const metodoPagoData = req.body as MetodoPago;
    const metodoPago = await metodoPagoService.crear(metodoPagoData);

    res.json({
        metodoPago,
    });
};

/**
 * @swagger
 * /metodopagos/{id}:
 *   get:
 *     summary: Recupera un método de pago por ID
 *     tags: [MetodoPagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del método de pago
 *     responses:
 *       200:
 *         description: Detalles del método de pago
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MetodoPago'
 *       404:
 *         description: Método de pago no encontrado
 */

export const GET_BY_ID = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const metodoPagoService: MetodoPagoService = req.scope.resolve("metodopagoService");
    const { id } = req.params;

    try {
        const metodoPago = await metodoPagoService.recuperar(id);
        res.json({ metodoPago });
    } catch (error) {
        res.status(404).json({ error: "Método de pago no encontrado" });
    }
};

/**
 * @swagger
 * /metodopagos/{id}:
 *   put:
 *     summary: Actualiza un método de pago por ID
 *     tags: [MetodoPagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del método de pago
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MetodoPago'
 *     responses:
 *       200:
 *         description: Método de pago actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MetodoPago'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Método de pago no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const metodoPagoService: MetodoPagoService = req.scope.resolve("metodopagoService");
    const { id } = req.params;
    const metodoPagoData = req.body as Partial<MetodoPago>;

    try {
        const metodoPago = await metodoPagoService.actualizar(id, metodoPagoData);
        res.json({ metodoPago });
    } catch (error) {
        if (error.message === "Método de pago no encontrado") {
            res.status(404).json({ error: "Método de pago no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /metodopagos/{id}:
 *   delete:
 *     summary: Elimina un método de pago por ID
 *     tags: [MetodoPagos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del método de pago
 *     responses:
 *       200:
 *         description: Método de pago eliminado exitosamente
 *       404:
 *         description: Método de pago no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const metodoPagoService: MetodoPagoService = req.scope.resolve("metodopagoService");
    const { id } = req.params;

    try {
        await metodoPagoService.eliminar(id);
        res.status(200).json({ message: "Método de pago eliminado exitosamente" });
    } catch (error) {
        res.status(404).json({ error: "Método de pago no encontrado" });
    }
};

export const AUTHENTICATE = false;
