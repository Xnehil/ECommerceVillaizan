import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  InventarioAlmacenService  from "../../../services/InventarioAlmacen"
import { InventarioAlmacen } from "src/models/InventarioAlmacen";

/**
 * @swagger
 * tags:
 *   name: InventariosAlmacen
 *   description: API para la gestión de inventarios de almacén
 */

/**
 * @swagger
 * /inventariosalmacen:
 *   get:
 *     summary: Lista todos los inventarios de almacén con paginación
 *     tags: [InventariosAlmacen]
 *     responses:
 *       200:
 *         description: Una lista de inventarios de almacén
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inventarioAlmacens:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/InventarioAlmacen'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioAlmacenService: InventarioAlmacenService = req.scope.resolve("inventarioalmacenService");

    res.json({
      inventarioAlmacens: await inventarioAlmacenService.listarConPaginacion(),
    })
  }

  /**
 * @swagger
 * /inventariosalmacen:
 *   post:
 *     summary: Crea un nuevo inventario de almacén
 *     tags: [InventariosAlmacen]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InventarioAlmacen'
 *     responses:
 *       201:
 *         description: El inventario de almacén ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InventarioAlmacen'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const inventarioAlmacenService: InventarioAlmacenService = req.scope.resolve("inventarioalmacenService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const inventarioAlmacenData = req.body as InventarioAlmacen;
    const inventarioAlmacen = await inventarioAlmacenService.crear(inventarioAlmacenData);

    res.status(201).json({
      inventarioAlmacen,
    });
  }

  /**
 * @swagger
 * /inventariosalmacen/{id}:
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

export const GET_BY_ID = async (
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
* /inventariosalmacen/{id}:
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
* /inventariosalmacen/{id}:
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
* /inventariosalmacen/{id}/aumentar:
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
* /inventariosalmacen/{id}/disminuir:
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