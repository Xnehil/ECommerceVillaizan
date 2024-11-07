import type { 
    MedusaRequest, 
    MedusaResponse,
  } from "@medusajs/medusa"
  
import { enviarMensajeAdmins } from "../../../loaders/websocketLoader";

export const POST = async (
    req: MedusaRequest,
    res: MedusaResponse
  ) => {
    const bodyData = req.body as { mensaje: string, type: string };
    const { mensaje, type } = bodyData;
  
    try {
      const response = enviarMensajeAdmins(type, mensaje);
      res.status(201).json({
        response
      });
    } catch (error) {
      res.status(405).json({ error: error.message });
    }
  };

  
  export const AUTHENTICATE = false