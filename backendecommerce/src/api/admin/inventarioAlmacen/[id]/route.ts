import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  InventarioAlmacenService  from "../../../../services/InventarioAlmacen"
import { InventarioAlmacen } from "src/models/InventarioAlmacen";

/**
 * @swagger
 * tags:
 *   name: InventariosAlmacen
 *   description: API para la gestión de inventarios de almacén
 */

/**
 * @swagger
 * /inventarioAlmacen/{id}:
 *   get:
 *     summary: Recupera un inventario de almacén por ID
 *     tags: [InventariosAlmacen]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del inventario de almacén
 *     responses:
 *       200:
 *         description: Detalles del inventario de almacén
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventarioAlmacen'
 *       404:
 *         description: Inventario de almacén no encontrado
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioAlmacenService: InventarioAlmacenService = req.scope.resolve("inventarioalmacenService");
    const { id } = req.params;
  
    try {
        const inventarioAlmacen = await inventarioAlmacenService.recuperar(id);
        res.json({ inventarioAlmacen });
    } catch (error) {
        res.status(404).json({ error: "Inventario de almacén no encontrado" });
    }
  };
  
  /**
  * @swagger
  * /inventarioAlmacen/{id}:
  *   put:
  *     summary: Actualiza un inventario de almacén por ID
  *     tags: [InventariosAlmacen]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: ID del inventario de almacén
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             $ref: '#/components/schemas/InventarioAlmacen'
  *     responses:
  *       200:
  *         description: Inventario de almacén actualizado exitosamente
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/InventarioAlmacen'
  *       400:
  *         description: Petición inválida
  *       404:
  *         description: Inventario de almacén no encontrado
  */
  
  export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioAlmacenService: InventarioAlmacenService = req.scope.resolve("inventarioalmacenService");
    const { id } = req.params;
    const inventarioAlmacenData = req.body as Partial<InventarioAlmacen>;
  
    try {
        const inventarioAlmacen = await inventarioAlmacenService.actualizar(id, inventarioAlmacenData);
        res.json({ inventarioAlmacen });
    } catch (error) {
        if (error.message === "InventarioAlmacen no encontrado") {
            res.status(404).json({ error: "Inventario de almacén no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
  };
  
  /**
  * @swagger
  * /inventarioAlmacen/{id}:
  *   delete:
  *     summary: Elimina un inventario de almacén por ID
  *     tags: [InventariosAlmacen]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: ID del inventario de almacén
  *     responses:
  *       200:
  *         description: Inventario de almacén eliminado exitosamente
  *       404:
  *         description: Inventario de almacén no encontrado
  */
  
  export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioAlmacenService: InventarioAlmacenService = req.scope.resolve("inventarioalmacenService");
    const { id } = req.params;
  
    try {
        const inventarioAlmacen = await inventarioAlmacenService.eliminar(id);
        res.status(200).json({ message: "Inventario de almacén eliminado exitosamente", inventarioAlmacen });
    } catch (error) {
        res.status(404).json({ error: "Inventario de almacén no encontrado" });
    }
  };
  
  /**
  * @swagger
  * /inventarioAlmacen/{id}/aumentar:
  *   patch:
  *     summary: Aumenta el stock de un inventario de almacén por ID
  *     tags: [InventariosAlmacen]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: ID del inventario de almacén
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               cantidad:
  *                 type: number
  *                 description: Cantidad a aumentar
  *     responses:
  *       200:
  *         description: Stock aumentado exitosamente
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/InventarioAlmacen'
  *       400:
  *         description: Petición inválida
  *       404:
  *         description: Inventario de almacén no encontrado
  */
  
  export const AUMENTAR_STOCK = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioAlmacenService: InventarioAlmacenService = req.scope.resolve("inventarioalmacenService");
    const { id } = req.params;
    const { cantidad } = req.body as { cantidad: number };
  
    if (typeof cantidad !== 'number' || cantidad <= 0) {
        res.status(400).json({ error: "Cantidad inválida" });
        return;
    }
  
    try {
        const inventarioAlmacen = await inventarioAlmacenService.aumentarStock(id, cantidad);
        res.json({ inventarioAlmacen });
    } catch (error) {
        res.status(404).json({ error: "Inventario de almacén no encontrado" });
    }
  };
  
  /**
  * @swagger
  * /inventarioAlmacen/{id}/disminuir:
  *   patch:
  *     summary: Disminuye el stock de un inventario de almacén por ID
  *     tags: [InventariosAlmacen]
  *     parameters:
  *       - in: path
  *         name: id
  *         schema:
  *           type: string
  *         required: true
  *         description: ID del inventario de almacén
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               cantidad:
  *                 type: number
  *                 description: Cantidad a disminuir
  *     responses:
  *       200:
  *         description: Stock disminuido exitosamente
  *         content:
  *           application/json:
  *             schema:
  *               $ref: '#/components/schemas/InventarioAlmacen'
  *       400:
  *         description: Petición inválida
  *       404:
  *         description: Inventario de almacén no encontrado
  */
  
  export const DISMINUIR_STOCK = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioAlmacenService: InventarioAlmacenService = req.scope.resolve("inventarioalmacenService");
    const { id } = req.params;
    const { cantidad } = req.body as { cantidad: number };
  
    if (typeof cantidad !== 'number' || cantidad <= 0) {
        res.status(400).json({ error: "Cantidad inválida" });
        return;
    }
  
    try {
        const inventarioAlmacen = await inventarioAlmacenService.disminuirStock(id, cantidad);
        res.json({ inventarioAlmacen });
    } catch (error) {
        res.status(404).json({ error: "Inventario de almacén no encontrado" });
    }
  };

  export const AUTHENTICATE = false