import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  ProductoService  from "../../../../services/Producto"
import { Producto } from "src/models/Producto";
/**

/**
 * @swagger
 * /producto/{id}:
 *   get:
 *     summary: Recupera un producto por ID
 *     tags: [Productos]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del producto
 *       - in: query
 *         name: enriquecido
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Si se debe recuperar el producto enriquecido
 *     responses:
 *       200:
 *         description: Detalles del producto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       404:
 *         description: Producto no encontrado
 */


export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const productoService: ProductoService = req.scope.resolve("productoService");
    const id = req.params.id;
    const enriquecido = req.query.enriquecido === 'true';
    try {
        const producto = enriquecido ? await productoService.recuperar(id, 
            {relations: ["tipoProducto", "subcategorias", "frutas"]}
        ) : await productoService.recuperar(id);
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
    const id = req.params.id;
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
    const id = req.params.id;

    try {
        await productoService.eliminar(id);
        res.status(200).json({ message: "producto eliminado exitosamente" });
    } catch (error) {
        res.status(404).json({ error: "producto no encontrado" });
    }
};

export const AUTHENTICATE = false