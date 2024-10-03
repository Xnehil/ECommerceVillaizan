import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  LibroReclamacionesService  from "../../../../services/LibroReclamaciones"
import { LibroReclamaciones } from "src/models/LibroReclamaciones";

/**
 * @swagger
 * tags:
 *   name: LibroReclamaciones
 *   description: API para la gestión de libros de reclamaciones
 */

/**
 * @swagger
 * /libroReclamaciones/{id}:
 *   get:
 *     summary: Recuperar libro de reclamaciones
 *     description: Recupera un libro de reclamaciones específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del libro de reclamaciones
 *     responses:
 *       '200':
 *         description: Libro de reclamaciones recuperado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 libroReclamaciones:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     descripcion:
 *                       type: string
 *                     fecha:
 *                       type: string
 *                       format: date-time
 *                     estado:
 *                       type: string
 *       '404':
 *         description: Libro de reclamaciones no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Libro de reclamaciones no encontrado"
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
    ) => {
    const libroReclamacionesService: LibroReclamacionesService = req.scope.resolve("libroreclamacionesService");
    
    const { id } = req.params;

    try {
        const libroReclamaciones = await libroReclamacionesService.recuperar(id);
        res.json({ libroReclamaciones });
    } catch (error) {
        res.status(404).json({ error: "Libro de reclamaciones no encontrado" });
    }
}
/**
 * @swagger
 * /libroReclamaciones/{id}:
 *   put:
 *     summary: Actualizar libro de reclamaciones
 *     description: Actualiza un libro de reclamaciones específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del libro de reclamaciones
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               fecha:
 *                 type: string
 *                 format: date-time
 *               estado:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Libro de reclamaciones actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 libroReclamaciones:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     descripcion:
 *                       type: string
 *                     fecha:
 *                       type: string
 *                       format: date-time
 *                     estado:
 *                       type: string
 *       '404':
 *         description: Libro de reclamaciones no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "LibroReclamaciones no encontrado"
 *       '400':
 *         description: Petición inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Petición inválida"
 */
export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
    ) => {
    const libroReclamacionesService: LibroReclamacionesService = req.scope.resolve("libroreclamacionesService");
    const { id } = req.params;
    const libroReclamacionesData = req.body as Partial<LibroReclamaciones>;
    try {
        const libroReclamaciones = await libroReclamacionesService.actualizar(id, libroReclamacionesData);
        res.json({ libroReclamaciones });
    }catch (error) {
        if (error.message === "LibroReclamaciones no encontrado") {
            res.status(404).json({ error: "LibroReclamaciones no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
}

/**
 * @swagger
 * /libroReclamaciones/{id}:
 *   delete:
 *     summary: Eliminar libro de reclamaciones
 *     description: Elimina un libro de reclamaciones específico por su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del libro de reclamaciones
 *     responses:
 *       '200':
 *         description: Libro de reclamaciones eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "LibroReclamaciones eliminado exitosamente"
 *                 libroReclamaciones:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     descripcion:
 *                       type: string
 *                     fecha:
 *                       type: string
 *                       format: date-time
 *                     estado:
 *                       type: string
 *       '404':
 *         description: Libro de reclamaciones no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "LibroReclamaciones no encontrado"
 */
export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const libroReclamacionesService: LibroReclamacionesService = req.scope.resolve("libroreclamacionesService");
    const { id } = req.params;

    try {
        const libroReclamaciones = await libroReclamacionesService.eliminar(id);
        res.status(200).json({ message: "LibroReclamaciones eliminado exitosamente", libroReclamaciones });
    } catch (error) {
        res.status(404).json({ error: "LibroReclamaciones no encontrado" });
    }
};