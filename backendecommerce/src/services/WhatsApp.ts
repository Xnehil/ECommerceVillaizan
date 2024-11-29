import { buildQuery, FindConfig, Selector, TransactionBaseService } from "@medusajs/medusa";
import { Client, LocalAuth } from "whatsapp-web.js";

import { whatsAppClient } from "../loaders/whatsappLoader";
import AjusteService from "./Ajuste";

class WhatsAppService extends TransactionBaseService {
    // private client: Client;
    protected ajusteService_ : AjusteService;

    constructor(container) {
        super(container);
        this.ajusteService_ = container.ajusteService;
    }

    async sendMessage(numero: string, mensaje: string): Promise<void> {
        try {
            const ajuste = await this.ajusteService_.recuperar('enviar_whatsapp');
            if (ajuste.valor === 'false') {
                console.log('No se enviará el mensaje al número: ', numero, ' porque la opción de enviar mensajes de WhatsApp está desactivada.');
                return;
            }
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
