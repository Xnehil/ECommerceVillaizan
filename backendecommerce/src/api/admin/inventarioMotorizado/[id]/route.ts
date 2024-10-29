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
 * /inventarioMotorizado/{id}:
 *   get:
 *     summary: Recupera un inventario motorizado por ID
 *     tags: [InventarioMotorizados]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del inventario motorizado
 *     responses:
 *       200:
 *         description: Detalles del inventario motorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventarioMotorizado'
 *       404:
 *         description: Inventario motorizado no encontrado
 */

  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioMotorizadoService: InventarioMotorizadoService = req.scope.resolve("inventariomotorizadoService");
    const { id } = req.params;
  
    try {
        const inventarioMotorizado = await inventarioMotorizadoService.recuperar(id);
        res.json({ inventarioMotorizado });
    } catch (error) {
        res.status(404).json({ error: "Inventario motorizado no encontrado" });
    }
  };
  
  /**
  * @swagger
  * /inventarioMotorizado/{id}:
  *   put:
  *     summary: Actualiza un inventario motorizado por ID
  *     tags: [InventarioMotorizados]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: ID del inventario motorizado
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/InventarioMotorizado'
  *     responses:
  *       200:
  *         description: Inventario motorizado actualizado exitosamente
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/InventarioMotorizado'
  *       400:
  *         description: Petición inválida
  *       404:
  *         description: Inventario motorizado no encontrado
  */
  
  export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioMotorizadoService: InventarioMotorizadoService = req.scope.resolve("inventariomotorizadoService");
    const { id } = req.params;
    const inventarioMotorizadoData = req.body as Partial<InventarioMotorizado>;
  
    try {
        const inventarioMotorizado = await inventarioMotorizadoService.actualizar(id, inventarioMotorizadoData);
        res.json({ inventarioMotorizado });
    } catch (error) {
        if (error.message === "InventarioMotorizado no encontrado") {
            res.status(404).json({ error: "Inventario motorizado no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
  };
  
  /**
  * @swagger
  * /inventarioMotorizado/{id}:
  *   delete:
  *     summary: Elimina un inventario motorizado por ID
  *     tags: [InventarioMotorizados]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: ID del inventario motorizado
  *     responses:
  *       200:
  *         description: Inventario motorizado eliminado exitosamente
  *       404:
  *         description: Inventario motorizado no encontrado
  */
  
  export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioMotorizadoService: InventarioMotorizadoService = req.scope.resolve("inventariomotorizadoService");
    const { id } = req.params;
  
    try {
        const inventarioMotorizado = await inventarioMotorizadoService.eliminar(id);
        res.status(200).json({ message: "Inventario motorizado eliminado exitosamente", inventarioMotorizado });
    } catch (error) {
        res.status(404).json({ error: "Inventario motorizado no encontrado" });
    }
  };
  

  export const AUTHENTICATE = false