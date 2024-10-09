import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import MotorizadoService from "../../../../services/Motorizado";
import { Motorizado } from "src/models/Motorizado";

/**
 * @swagger
 * tags:
 *   name: Motorizados
 *   description: API para la gestión de motorizados
 */

/**
 * @swagger
 * /motorizado/{id}:
 *   get:
 *     summary: Recupera un motorizado por ID
 *     tags: [Motorizados]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del motorizado
 *       - in: query
 *         name: enriquecido
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Si se debe recuperar el producto enriquecido
 *     responses:
 *       200:
 *         description: Detalles del motorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Motorizado'
 *       404:
 *         description: Motorizado no encontrado
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const motorizadoService: MotorizadoService = req.scope.resolve("motorizadoService");
    const { id } = req.params;
    const enriquecido = req.query.enriquecido === 'true';
    try {
        const motorizado = await motorizadoService.recuperar(id,
            {
                relations: enriquecido ? ["usuario"] : []
            }
        );
        res.json({ motorizado });
    } catch (error) {
        res.status(404).json({ error: "Motorizado no encontrado" });
    }
};

/**
 * @swagger
 * /motorizado/{id}:
 *   put:
 *     summary: Actualiza un motorizado por ID
 *     tags: [Motorizados]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del motorizado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Motorizado'
 *     responses:
 *       200:
 *         description: Motorizado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Motorizado'
 *       400:
 *         description: Petición inválida
 *       404:
 *         description: Motorizado no encontrado
 */

export const PUT = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const motorizadoService: MotorizadoService = req.scope.resolve("motorizadoService");
    const { id } = req.params;
    const motorizadoData = req.body as Partial<Motorizado>;

    try {
        const motorizado = await motorizadoService.actualizar(id, motorizadoData);
        res.json({ motorizado });
    } catch (error) {
        if (error.message === "Motorizado no encontrado") {
            res.status(404).json({ error: "Motorizado no encontrado" });
        } else {
            res.status(400).json({ error: "Petición inválida" });
        }
    }
};

/**
 * @swagger
 * /motorizado/{id}:
 *   delete:
 *     summary: Elimina un motorizado por ID
 *     tags: [Motorizados]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del motorizado
 *     responses:
 *       200:
 *         description: Motorizado eliminado exitosamente
 *       404:
 *         description: Motorizado no encontrado
 */

export const DELETE = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const motorizadoService: MotorizadoService = req.scope.resolve("motorizadoService");
    const { id } = req.params;

    try {
        const motorizado = await motorizadoService.eliminar(id);
        res.status(200).json({ message: "Motorizado eliminado exitosamente", motorizado });
    } catch (error) {
        res.status(404).json({ error: "Motorizado no encontrado" });
    }
};

export const AUTHENTICATE = false;