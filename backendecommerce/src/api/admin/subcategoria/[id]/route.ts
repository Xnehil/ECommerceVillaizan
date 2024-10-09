import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  SubcategoriaService  from "../../../../services/Subcategoria"
import { Subcategoria } from "src/models/Subcategoria";
/**

/**
 * @swagger
 * /subcategoria/{id}:
 *   get:
 *     summary: Recupera un subcategoria por ID
 *     tags: [Subcategorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del subcategoria
 *     responses:
 *       200:
 *         description: Detalles del subcategoria
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subcategoria'
 *       404:
 *         description: Subcategoria no encontrado
 */


export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const subcategoriaService: SubcategoriaService = req.scope.resolve("subcategoriaService");
    const id = req.params.id;

    try {
        const subcategoria = await subcategoriaService.recuperar(id);
        res.json({ subcategoria });
    } catch (error) {
        res.status(404).json({ error: "subcategoria no encontrado" });
    }
};

/**
 * @swagger
 * /subcategoria/{id}:
 *   put:
 *     summary: Actualiza un subcategoria por ID
 *     tags: [Subcategorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del subcategoria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/subcategoria'
 *     responses:
 *       200:
 *         description: subcategoria actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/subcategoria'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: subcategoria no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const subcategoriaService: SubcategoriaService = req.scope.resolve("subcategoriaService");
    const id = req.params.id;
    const subcategoriaData = req.body as Partial<Subcategoria>;

    try {
        const subcategoria = await subcategoriaService.actualizar(id, subcategoriaData);
        res.json({ subcategoria });
    } catch (error) {
        if (error.message === "subcategoria no encontrado") {
            res.status(404).json({ error: "subcategoria no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /subcategoria/{id}:
 *   delete:
 *     summary: Elimina un subcategoria por ID
 *     tags: [Subcategorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del subcategoria
 *     responses:
 *       200:
 *         description: subcategoria eliminado exitosamente
 *       404:
 *         description: subcategoria no encontrado
 *      406:
 *        description: Hay productos asociados a esta subcategoría
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const subcategoriaService: SubcategoriaService = req.scope.resolve("subcategoriaService");
    const id = req.params.id;

    try {
        await subcategoriaService.eliminar(id);
        res.status(200).json({ message: "subcategoria eliminado exitosamente" });
    } catch (error ) {
        console.log("Error: ", error.message);
        if (error.message === "productos asociados") {
            return res.status(406).json({ error: "Hay productos asociados a esta subcategoría" });
        }
        return res.status(404).json({ error: "subcategoria no encontrado" });
    }
};

export const AUTHENTICATE = false