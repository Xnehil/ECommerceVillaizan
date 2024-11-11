import { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import CorreoService from "@services/Correo";

interface Correo {
    to: string;
    subject: string;
    text: string;
    html?: string;
}

  /**
 * @swagger
 * /correo:
 *   post:
 *     summary: Send an email
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: Destinatario del correo
 *               subject:
 *                 type: string
 *                 description: Asunto del correo
 *               text:
 *                 type: string
 *                 description:  Texto del correo
 *               html:
 *                 type: string
 *                 description: HTML del correo
 *     responses:
 *       201:
 *         description: Se ha enviado el correo exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   description: Response from the email service
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Failed to send email
 */
  export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const correoService: CorreoService = req.scope.resolve("correoService");

    if (!req.body) {
      res.status(400).json({ error: "Petición inválida" });
      return;
    }
    const correoData = req.body as Correo;
    const response = await correoService.sendEmail(correoData.to, correoData.subject, correoData.text, correoData.html);

    res.status(201).json({
        response,
    });
  }

  export const AUTHENTICATE = false