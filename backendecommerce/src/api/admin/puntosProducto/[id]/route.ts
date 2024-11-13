import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import PuntosProductoService from "../../../../services/PuntosProducto";
import { PuntosProducto } from "src/models/PuntosProducto";

/**
 * @swagger
 * tags:
 *   name: PuntosProductos
 *   description: API para la gestión de puntos de productos
 */

/**
 * @swagger
 * /puntosProducto/{id}:
 *   get:
 *     summary: Recupera un puntosProducto por ID
 *     tags: [PuntosProductos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del puntosProducto
 *     responses:
 *       200:
 *         description: Detalles del puntosProducto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PuntosProducto'
 *       404:
 *         description: PuntosProducto no encontrado
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const puntosProductoService: PuntosProductoService = req.scope.resolve("puntosproductoService");
    const { id } = req.params;

    try {
        const puntosProducto = await puntosProductoService.recuperar(id);
        res.json({ puntosProducto });
    } catch (error) {
        res.status(404).json({ error: "PuntosProducto no encontrado",
            message: error.message });
    }
};

/**
 * @swagger
 * /puntosProducto/{id}:
 *   put:
 *     summary: Actualiza un puntosProducto por ID
 *     tags: [PuntosProductos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del puntosProducto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PuntosProducto'
 *     responses:
 *       200:
 *         description: PuntosProducto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PuntosProducto'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: PuntosProducto no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const puntosProductoService: PuntosProductoService = req.scope.resolve("puntosproductoService");
    const { id } = req.params;
    const puntosProductoData = req.body as Partial<PuntosProducto>;

    try {
        const puntosProducto = await puntosProductoService.actualizar(id, puntosProductoData);
        res.json({ puntosProducto });
    } catch (error) {
        if (error.message === "PuntosProducto no encontrado") {
            res.status(404).json({ error: "PuntosProducto no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /puntosProducto/{id}:
 *   delete:
 *     summary: Elimina un puntosProducto por ID
 *     tags: [PuntosProductos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del puntosProducto
 *     responses:
 *       200:
 *         description: PuntosProducto eliminado exitosamente
 *       404:
 *         description: PuntosProducto no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const puntosProductoService: PuntosProductoService = req.scope.resolve("puntosproductoService");
    const { id } = req.params;

    try {
        await puntosProductoService.eliminar(id);
        res.status(200).json({ message: "PuntosProducto eliminado exitosamente" });
    } catch (error) {
        res.status(404).json({ error: "PuntosProducto no encontrado" });
    }
};

export const AUTHENTICATE = false;