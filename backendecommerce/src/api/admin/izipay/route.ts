import type { 
    MedusaRequest, 
    MedusaResponse,
} from "@medusajs/medusa";

import IziPayService from "@services/IziPay";

/**
 * @swagger
 * tags:
 *   name: IziPay
 *   description: API para el manejo de iziPay
 */

/**
 * @swagger
 * /izipay:
 *   post:
 *     summary: Solicita un token para iziPay
 *     tags: [IziPay]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monto:
 *                 type: string
 *                 example: "15.00"
 *               orderNumber:
 *                 type: string
 *                 example: "R202211101518"
 *               transactionId:
 *                 type: string
 *                 example: "16868479028040"
 *     responses:
 *       201:
 *         description: El token ha sido creado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *       400:
 *         description: Petición inválida
 */
export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const iziPayService: IziPayService = req.scope.resolve("izipayService");

    if (!req.body) {
        res.status(400).json({ error: "Petición inválida" });
        return;
    }
    const { monto, orderNumber, transactionId } = req.body as { monto: string, orderNumber: string, transactionId: string };

    if (!monto || !orderNumber || !transactionId) {
      return res.status(400).json({ error: 'Petición inválida. Faltan parámetros requeridos.' });
    }
  
    try {
      const token = await iziPayService.generarToken(orderNumber, monto, transactionId);
      res.status(201).json({ response: { token } });
    } catch (error) {
      res.status(400).json({ error: 'Petición inválida' });
    }
};



export const AUTHENTICATE = false;
