import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  NotificacionService  from "@services/Notificacion"
import { Notificacion } from "src/models/Notificacion";
/**

/**
 * @swagger
 * /notificacion/{id}:
 *   get:
 *     summary: Recupera un notificacion por ID
 *     tags: 
 *       - Notificacions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del notificacion
 *     responses:
 *       200:
 *         description: Detalles del notificacion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notificacion'
 *       404:
 *         description: Notificacion no encontrado
 */


export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const notificacionService: NotificacionService = req.scope.resolve("notificacionService");
    const id = req.params.id;

    try {
        const notificacion = await notificacionService.recuperar(id);
        res.json({ notificacion });
    } catch (error) {
        res.status(404).json({ error: "notificacion no encontrado" });
    }
};

/**
 * @swagger
 * /notificacion/{id}:
 *   put:
 *     summary: Actualiza un notificacion por ID
 *     tags: [Notificacions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del notificacion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/notificacion'
 *     responses:
 *       200:
 *         description: notificacion actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/notificacion'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: notificacion no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const notificacionService: NotificacionService = req.scope.resolve("notificacionService");
    const id = req.params.id;
    const notificacionData = req.body as Partial<Notificacion>;

    try {
        const notificacion = await notificacionService.actualizar(id, notificacionData);
        res.json({ notificacion });
    } catch (error) {
        res.status(400).json({ error: "Petición inválida" });
    }
};

/**
 * @swagger
 * /notificacion/{id}:
 *   delete:
 *     summary: Elimina un notificacion por ID
 *     tags: 
 *       - Notificacions
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del notificacion
 *     responses:
 *       200:
 *         description: notificacion eliminado exitosamente
 *       404:
 *         description: notificacion no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const notificacionService: NotificacionService = req.scope.resolve("notificacionService");
    const id = req.params.id;

    try {
        await notificacionService.eliminar(id);
        res.status(200).json({ message: "notificacion eliminado exitosamente" });
    } catch (error ) {
        console.log("Error: ", error.message);
        return res.status(404).json({ error: "notificacion no encontrado" });
    }
};

export const AUTHENTICATE = false