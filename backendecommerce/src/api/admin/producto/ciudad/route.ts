import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  ProductoService  from "../../../../services/Producto"
import { Producto } from "src/models/Producto";
/**
 * @swagger
 * components:
 *   schemas:
 *     ProductoRequestBody:
 *       type: object
 *       required:
 *         - id_ciudad
 *       properties:
 *         id_ciudad:
 *           type: string
 *           description: ID de la ciudad para recuperar productos
 * 
 * /producto/ciudad:
 *   post:
 *     summary: Recuperar productos por ciudad
 *     description: Recupera una lista de productos basados en el ID de la ciudad proporcionado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductoRequestBody'
 *     responses:
 *       200:
 *         description: Lista de productos recuperados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nombre:
 *                     type: string
 *                   precio:
 *                     type: number
 *       400:
 *         description: Petición inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Petición inválida
 *       404:
 *         description: Motorizado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Motorizado no encontrado
 */
interface ProductoRequestBody {
    id_ciudad: string;
}

export const POST = async (
    req: MedusaRequest & { body: ProductoRequestBody },
    res: MedusaResponse
) => {
    const productoService: ProductoService = req.scope.resolve("productoService");
    const { id_ciudad } = req.body;

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }

    try {
        const productos = await productoService.recuperarProductosPorCiudad(id_ciudad
        );
        res.json({ productos });
    } catch (error) {
        res.status(404).json({ error: "Motorizado no encontrado", message: error.message });
    }
};

export const AUTHENTICATE = false;