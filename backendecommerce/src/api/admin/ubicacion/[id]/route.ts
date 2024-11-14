import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  UbicacionService  from "../../../../services/Ubicacion"
import { Ubicacion } from "src/models/Ubicacion";
/**

/**
 * @swagger
 * /ubicacion/{id}:
 *   get:
 *     summary: Recupera una ubicacion por ID
 *     tags: 
 *       - Ubicaciones
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la ubicacion
 *     responses:
 *       200:
 *         description: Detalles de la ubicacion
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Ubicacion'
 *       404:
 *         description: Ubicacion no encontrada
 */


export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ubicacionService: UbicacionService = req.scope.resolve("ubicacionService");
    const id = req.params.id;

    try {
        const ubicacion = await ubicacionService.recuperar(id);
        res.json({ ubicacion });
    } catch (error) {
        res.status(404).json({ error: "ubicacion no encontrada" });
    }
};

/**
 * @swagger
 * /ubicacion/{id}:
 *   put:
 *     summary: Actualiza una ubicacion por ID
 *     tags: [Ubicaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la ubicacion
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ubicacion'
 *     responses:
 *       200:
 *         description: ubicacion actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ubicacion'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: ubicacion no encontrada
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ubicacionService: UbicacionService = req.scope.resolve("ubicacionService");
    const id = req.params.id;
    const ubicacionData = req.body as Partial<Ubicacion>;

    try {
        const ubicacion = await ubicacionService.actualizar(id, ubicacionData);
        res.json({ ubicacion });
    } catch (error) {
        if (error.message.includes("Ubicacion con nombre")) {
            res.status(404).json({ error: "Ubicacion con ese nombre ya existe" });
            return;
        }
        if (error.message === "ubicacion no encontrada") {
            res.status(404).json({ error: "ubicacion no encontrada" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /ubicacion/{id}:
 *   delete:
 *     summary: Elimina una ubicacion por ID
 *     tags: 
 *       - Ubicaciones
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la ubicacion
 *     responses:
 *       200:
 *         description: ubicacion eliminada exitosamente
 *       404:
 *         description: ubicacion no encontrada
 *       406:
 *         description: Hay productos asociados a esta ubicacion
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const ubicacionService: UbicacionService = req.scope.resolve("ubicacionService");
    const id = req.params.id;

    try {
        await ubicacionService.eliminar(id);
        res.status(200).json({ message: "ubicacion eliminada exitosamente" });
    } catch (error ) {
        console.log("Error: ", error.message);
        if (error.message === "productos asociados") {
            return res.status(406).json({ error: "Hay productos asociados a esta ubicacion" });
        }
        return res.status(404).json({ error: "ubicacion no encontrada" });
    }
};

export const AUTHENTICATE = false