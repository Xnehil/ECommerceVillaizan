import {
    ProductService,
    ConfigModule,
    MedusaContainer,
  } from "@medusajs/medusa";
import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from 'qrcode-terminal';

export let whatsAppClient: Client | null = null;
export default async (
    container: MedusaContainer,
    config: ConfigModule
  ): Promise<void> => {
    if (whatsAppClient) {
        console.log('WhatsApp client is already initialized.');
        return;
      }

    whatsAppClient = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: { 
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-gpu',
                '--blink-settings=imagesEnabled=false',
                '--disable-extensions',
                '--disable-dev-shm-usage',
                '--window-size=800,600'
              ]
         }
    });

    whatsAppClient.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });
        console.log('Escanea el código QR con tu teléfono para iniciar sesión en WhatsApp');
    });

    whatsAppClient.on('ready', () => {
        console.log('WhatsApp client is ready!');
    });

    whatsAppClient.on('authenticated', () => {
        console.log('WhatsApp client is authenticated!');
    });

    whatsAppClient.on('auth_failure', (msg) => {
        console.error('Authentication failure:', msg);
    });

    whatsAppClient.on('disconnected', (reason) => {
        console.log('WhatsApp client disconnected:', reason);
    });

    await whatsAppClient.initialize();
  };