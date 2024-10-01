import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  ProductoService  from "../../../services/Producto"
import { Producto } from "src/models/Producto";
/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: API para la gestión de productos
 */

/**
 * @swagger
 * /productos:
 *   get:
 *     summary: Lista todos los productos con paginación
 *     tags: [Productos]
 *     responses:
 *       200:
 *         description: Una lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productos:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Producto'
 */
  export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const productoService: ProductoService = req.scope.resolve("productoService");

    res.json({
      productos: await productoService.listarConPaginacion(),
    })
  }


  /**
 * @swagger
 * /productos:
 *   post:
 *     summary: Crea un nuevo producto
 *     tags: [Productos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: El producto ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       400:
 *         description: Petición inválida
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const productoService: ProductoService = req.scope.resolve("productoService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const productoData = req.body as Producto;
    const producto = await productoService.crear(productoData);

    res.status(201).json({
      producto,
    });
  }

  export const GET_BY_ID = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const productoService: ProductoService = req.scope.resolve("productoService");
    const { id } = req.params;

    try {
        const producto = await productoService.recuperar(id);
        res.json({ producto });
    } catch (error) {
        res.status(404).json({ error: "producto no encontrado" });
    }
};

/**
 * @swagger
 * /producto/{id}:
 *   put:
 *     summary: Actualiza un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/producto'
 *     responses:
 *       200:
 *         description: producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/producto'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: producto no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const productoService: ProductoService = req.scope.resolve("productoService");
    const { id } = req.params;
    const productoData = req.body as Partial<Producto>;

    try {
        const producto = await productoService.actualizar(id, productoData);
        res.json({ producto });
    } catch (error) {
        if (error.message === "producto no encontrado") {
            res.status(404).json({ error: "producto no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /producto/{id}:
 *   delete:
 *     summary: Elimina un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: producto eliminado exitosamente
 *       404:
 *         description: producto no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const productoService: ProductoService = req.scope.resolve("productoService");
    const { id } = req.params;

    try {
        await productoService.eliminar(id);
        res.status(200).json({ message: "producto eliminado exitosamente" });
    } catch (error) {
        res.status(404).json({ error: "producto no encontrado" });
    }
};


  export const AUTHENTICATE = false