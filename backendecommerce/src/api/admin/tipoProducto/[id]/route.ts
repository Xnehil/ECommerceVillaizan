import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  TipoProductoService  from "../../../../services/TipoProducto"
import { TipoProducto } from "src/models/TipoProducto";
/**

/**
 * @swagger
 * /tipoProducto/{id}:
 *   get:
 *     summary: Recupera un tipoProducto por ID
 *     tags: [TipoProducto]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del tipoProducto
 *     responses:
 *       200:
 *         description: Detalles del tipoProducto
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TipoProducto'
 *       404:
 *         description: TipoProducto no encontrado
 */


export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const tipoProductoService: TipoProductoService = req.scope.resolve("tipoproductoService");
    const id = req.params.id;

    try {
        const tipoProducto = await tipoProductoService.recuperar(id);
        res.json({ tipoProducto });
    } catch (error) {
        res.status(404).json({ error: "tipoProducto no encontrado" });
    }
};

/**
 * @swagger
 * /tipoProducto/{id}:
 *   put:
 *     summary: Actualiza un tipoProducto por ID
 *     tags: [TipoProducto]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del tipoProducto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/tipoProducto'
 *     responses:
 *       200:
 *         description: tipoProducto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/tipoProducto'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: tipoProducto no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const tipoProductoService: TipoProductoService = req.scope.resolve("tipoproductoService");
    const id = req.params.id;
    const tipoProductoData = req.body as Partial<TipoProducto>;

    try {
        const tipoProducto = await tipoProductoService.actualizar(id, tipoProductoData);
        res.json({ tipoProducto });
    } catch (error) {
        if (error.message.includes("Tipo de producto con nombre")) {
            res.status(404).json({ error: "Tipo de producto con ese nombre ya existe" });
            return;
        }
        if (error.message === "tipoProducto no encontrado") {
            res.status(404).json({ error: "tipoProducto no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /tipoProducto/{id}:
 *   delete:
 *     summary: Elimina un tipoProducto por ID
 *     tags: [TipoProducto]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del tipoProducto
 *     responses:
 *       200:
 *         description: tipoProducto eliminado exitosamente
 *       404:
 *         description: tipoProducto no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const tipoProductoService: TipoProductoService = req.scope.resolve("tipoproductoService");
    const id = req.params.id;

    try {
        await tipoProductoService.eliminar(id);
        res.status(200).json({ message: "tipoProducto eliminado exitosamente" });
    } catch (error) {
        console.log("Error: ", error.message);
        if (error.message === "No se puede eliminar este tipo de producto porque tiene productos asociados") {
            return res.status(406).json({ error: "No se puede eliminar este tipo de producto porque tiene productos asociados" });
        }
        return res.status(404).json({ error: "tipoProducto no encontrado" });
    }
};

export const AUTHENTICATE = false