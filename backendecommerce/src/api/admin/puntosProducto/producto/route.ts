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
 * /puntosProducto/producto:
 *   post:
 *     summary: Retrieve active product points
 *     description: Retrieve the active points for a given product by its ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PuntosProductoRequestBody'
 *     responses:
 *       200:
 *         description: Successfully retrieved product points
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 puntosProducto:
 *                   type: object
 *                   description: The points of the product
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Petición inválida
 *       404:
 *         description: Product points not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: PuntosProducto no encontrado
 */

interface PuntosProductoRequestBody {
    id_producto: string;
}

export const POST = async (
    req: MedusaRequest & { body: PuntosProductoRequestBody },
    res: MedusaResponse
) => {
    const puntosProductoService: PuntosProductoService = req.scope.resolve("puntosproductoService");
    const { id_producto } = req.body;

    try {
        const puntosProducto = await puntosProductoService.encontrarPuntosPorProductoActivo(id_producto);
        res.json({ puntosProducto });
    } catch (error) {
        if (error.message === "PuntosProducto no encontrado") {
            res.status(404).json({ error: "PuntosProducto no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};



export const AUTHENTICATE = false;