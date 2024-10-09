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
 * /motorizado/usuario/{id_usuario}:
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
interface MetodoPagoRequestBody {
    id_usuario: string;
}

export const POST = async (
    req: MedusaRequest & { body: MetodoPagoRequestBody },
    res: MedusaResponse
) => {
    const motorizadoService: MotorizadoService = req.scope.resolve("motorizadoService");
    const { id_usuario } = req.body;
    //const enriquecido = req.query.enriquecido === 'true';
    //log de la solicitud
    console.log("Solicitud", req.body);
    try {
        const motorizado = await motorizadoService.listarPorUsuarioId(id_usuario
        );
        res.json({ motorizado });
    } catch (error) {
        res.status(404).json({ error: "Motorizado no encontrado" });
    }
};

export const AUTHENTICATE = false;