import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import  WhatsAppService  from "@services/WhatsApp"

/**
 * @swagger
 * tags:
 *   name: WhatsApp
 *   description: API para la gestión de whatsApps
 */

/**



/**
 * @swagger
 * /whatsApp:
 *   post:
 *     summary: Envía un nuevo mensaje de WhatsApp
 *     tags: [WhatsApp]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mensaje:
 *                 type: string
 *                 example: "Este es un mensaje de WhatsApp enviado desde la API"
 *               numero:
 *                 type: string
 *                 pattern: "^[0-9]{9}$"
 *                 example: "51901320560"
 *     responses:
 *       201:
 *         description: El mensaje de WhatsApp ha sido enviado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                 numero:
 *                   type: string
 *       400:
 *         description: Petición inválida
 *       405:
 *         description: Ya existe un mensaje de WhatsApp con ese número
 */

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const whatsAppService: WhatsAppService = req.scope.resolve("whatsappService");
    const bodyData = req.body as { mensaje: string, numero: string };
    if (!bodyData || typeof bodyData.mensaje !== 'string' || !/^[0-9]{9}$/.test(bodyData.numero)) {
      res.status(400).json({ error: "Petición inválida, el mensaje debe ser un string y el número debe tener 9 dígitos" });
      return;
    }
  
    const { mensaje, numero } = bodyData;
  
    try {
      const response = await whatsAppService.sendMessage(numero, mensaje);
      res.status(201).json({
        mensaje,
        numero,
        response
      });
    } catch (error) {
      res.status(405).json({ error: error.message });
    }
  };

  
  export const AUTHENTICATE = false