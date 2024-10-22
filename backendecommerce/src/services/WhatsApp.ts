import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Client, LocalAuth } from "whatsapp-web.js";

import { whatsAppClient } from "../loaders/whatsappLoader";

class WhatsAppService extends TransactionBaseService {
    // private client: Client;

    constructor(container) {
        super(container);
    }

    async sendMessage(numero: string, mensaje: string): Promise<void> {
        try {
            const chatId = `51${numero}@c.us`;
            await whatsAppClient.sendMessage(chatId, mensaje);
            console.log('Mensaje enviado a:', chatId);
        } catch (error) {
            console.error('Error al enviar mensaje de WhatsApp:', error);
            throw error;
        }
    }
}

export default WhatsAppService;
