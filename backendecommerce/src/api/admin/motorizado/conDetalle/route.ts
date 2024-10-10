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
 * /motorizado/conDetalle:
 *   get:
 *     summary: Obtener lista de motorizados con detalle
 *     description: Obtiene una lista de motorizados con sus detalles asociados.
 *     tags: [Motorizados]
 *     responses:
 *       200:
 *         description: Lista de motorizados obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 motorizados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Motorizado'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No autorizado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error interno del servidor
 */

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const motorizadoService: MotorizadoService = req.scope.resolve("motorizadoService");
    res.json({
      motorizados: await motorizadoService.recuperarListaMotorizadosConDetalle(
      ),
    })
  }

export const AUTHENTICATE = false