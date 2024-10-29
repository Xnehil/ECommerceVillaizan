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
 * /motorizado/usuario:
 *   post:
 *     summary: Recupera un motorizado por ID
 *     tags: [Motorizados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_usuario:
 *                 type: string
 *                 description: ID del motorizado
 *                 example: "12345"
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
interface MetodoPagoRequestBody {
    id_usuario: string;
}

export const POST = async (
    req: MedusaRequest & { body: MetodoPagoRequestBody },
    res: MedusaResponse
) => {
    const motorizadoService: MotorizadoService = req.scope.resolve("motorizadoService");
    const { id_usuario } = req.body;

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }

    try {
        const motorizado = await motorizadoService.listarPorUsuarioId(id_usuario
        );
        res.json({ motorizado });
    } catch (error) {
        res.status(404).json({ error: "Motorizado no encontrado" });
    }
};

export const AUTHENTICATE = false;