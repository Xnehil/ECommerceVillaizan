import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  InventarioMotorizadoService  from "../../../../../services/InventarioMotorizado"
import { InventarioMotorizado } from "src/models/InventarioMotorizado";
  
/**
 * @swagger
 * /inventarioMotorizado/disminuir/{id}:
 *   post:
 *     summary: Disminuir stock de inventario motorizado
 *     description: Endpoint para disminuir el stock de un inventario motorizado específico.
 *     tags:
 *       - InventarioMotorizado
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del inventario motorizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cantidad:
 *                 type: number
 *                 description: Cantidad a disminuir en el stock
 *                 example: 5
 *     responses:
 *       200:
 *         description: Inventario motorizado actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inventarioMotorizado:
 *                   $ref: '#/components/schemas/InventarioMotorizado'
 *       400:
 *         description: Cantidad inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Cantidad inválida"
 *       404:
 *         description: Inventario motorizado no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Inventario motorizado no encontrado"
 */
  
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioMotorizadoService: InventarioMotorizadoService = req.scope.resolve("inventariomotorizadoService");
    const { id } = req.params;
    const { cantidad } = req.body as { cantidad: number };
  
    if (typeof cantidad !== 'number' || cantidad <= 0) {
        res.status(400).json({ error: "Cantidad inválida" });
        return;
    }
  
    try {
        const inventarioMotorizado = await inventarioMotorizadoService.disminuirStock(id, cantidad);
        res.json({ inventarioMotorizado });
    } catch (error) {
        res.status(404).json({ error: "Inventario motorizado no encontrado" });
    }
  };

  export const AUTHENTICATE = false