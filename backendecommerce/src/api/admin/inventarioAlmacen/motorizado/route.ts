import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  InventarioAlmacenService  from "../../../../services/InventarioAlmacen"
import { InventarioAlmacen } from "src/models/InventarioAlmacen";
import InventarioMotorizadoService from "@services/InventarioMotorizado";

/**
 * @swagger
 * tags:
 *   name: InventariosAlmacen
 *   description: API para la gestión de motorizados
 */

/**
 * @swagger
 * /inventarioAlmacen/motorizado:
 *   post:
 *     summary: Obtener inventario de un motorizado
 *     description: Obtiene el inventario asociado a un motorizado específico.
 *     tags: [Motorizados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_motorizado
 *             properties:
 *               id_motorizado:
 *                 type: string
 *                 description: ID del motorizado
 *     responses:
 *       200:
 *         description: Inventario del motorizado obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inventarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventarioMotorizado'
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
interface InventarioMotorizadoRequestBody {
    id_motorizado: string;
}

export const POST = async (
    req: MedusaRequest & { body: InventarioMotorizadoRequestBody },
    res: MedusaResponse
) => {
    const inventarioMotorizadoService: InventarioMotorizadoService = req.scope.resolve("inventariomotorizadoService");
    const { id_motorizado } = req.body;

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }

    try {
        const inventarios = await inventarioMotorizadoService.findByMotorizadoId(id_motorizado
        );
        res.json({ inventarios });
    } catch (error) {
        res.status(404).json({ error: "Motorizado no encontrado" });
    }
};

export const AUTHENTICATE = false;
