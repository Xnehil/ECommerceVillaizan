import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  InventarioMotorizadoService  from "../../../../services/InventarioMotorizado"
import { InventarioMotorizado } from "src/models/InventarioMotorizado";

/**
 * @swagger
 * tags:
 *   name: InventarioMotorizado
 *   description: API para la gestión de inventarioMotorizadoes
 */

/**
 * @swagger
 * /inventarioMotorizado/ciudad:
 *   post:
 *     summary: Obtener inventario motorizado por ciudad
 *     description: Obtiene el inventario motorizado asociado a una ciudad específica.
 *     tags: [InventarioMotorizado]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_ciudad
 *             properties:
 *               id_ciudad:
 *                 type: string
 *                 description: ID de la ciudad
 *     responses:
 *       200:
 *         description: Inventario motorizado obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inventarios:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventarioMotorizado'
 *       404:
 *         description: Inventario motorizado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Inventario motorizado no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor
 */

interface InventarioMotorizadoRequestBody {
    id_ciudad: string;
}
  
  export const POST = async (
    req: MedusaRequest & { body: InventarioMotorizadoRequestBody },
    res: MedusaResponse
  ) => {
    const inventarioMotorizadoService: InventarioMotorizadoService = req.scope.resolve("inventariomotorizadoService");
    const { id_ciudad } = req.body;
  
    try {
        const inventarios = await inventarioMotorizadoService.findByCiudadId(id_ciudad);
        res.json({ inventarios });
    } catch (error) {
        res.status(404).json({ error: "Inventario motorizado no encontrado" });
    }
  };

  export const AUTHENTICATE = false