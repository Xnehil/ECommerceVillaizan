import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import MetodoPagoService from "../../../../services/MetodoPago";
import { MetodoPago } from "src/models/MetodoPago";

/**
 * @swagger
 * /metodoPago/nombre/{nombre}:
 *   get:
 *     summary: Recupera un método de pago por nombre
 *     tags: [MetodoPagos]
 *     parameters:
 *       - in: path
 *         name: nombre
 *         schema:
 *           type: string
 *         required: true
 *         description: Nombre del método de pago
 *     responses:
 *       200:
 *         description: Detalles del método de pago
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MetodoPago'
 *       404:
 *         description: Método de pago no encontrado
 */
interface MetodoPagoRequestBody {
    nombre: string;
}

export const POST = async (
    req: MedusaRequest & { body: MetodoPagoRequestBody },
    res: MedusaResponse
) => {
    const metodoPagoService: MetodoPagoService = req.scope.resolve("metodopagoService");
    const { nombre } = req.body;

    try {
        const metodoPago = await metodoPagoService.recuperarPorNombre(nombre);
        res.json({ metodoPago });
    } catch (error) {
        res.status(404).json({ error: "Método de pago no encontrado" });
    }
};

export const AUTHENTICATE = false;