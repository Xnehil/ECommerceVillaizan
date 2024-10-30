import {
    ConfigModule,
    MedusaContainer,
  } from "@medusajs/medusa";
  import cron from 'node-cron';
  import { LessThan } from 'typeorm';
  import { Pedido } from '@models/Pedido';
  import AjusteService from '@services/Ajuste';
import { enviarMensajeCliente } from "./websocketLoader";
  
  export default async (container: MedusaContainer, config: ConfigModule): Promise<void> => {
    async function cancelSolicitadoPedidos() {
    //   console.log("Scheduled job 'cancelSolicitadoPedidos' started.");
  
      const pedidoRepository = container.resolve('pedidoRepository');
      const ajusteService: AjusteService = container.resolve('ajusteService');
  
      const esperaMaxima = await ajusteService.recuperar('tiempo_confirmacion').then((ajuste) => {
        return Number(ajuste.valor);
      });
  
      const now = new Date();
      const thresholdDate = new Date(now.getTime() - esperaMaxima * 60 * 1000);
    //   console.log(`Canceling pedidos solicitados before ${thresholdDate}`);
  
      const pedidosToCancel = await pedidoRepository.find({
        where: {
          estado: 'solicitado',
          solicitadoEn: LessThan(thresholdDate),
        },
      });
  
      for (const pedido of pedidosToCancel) {
        pedido.estado = 'cancelado';
        await pedidoRepository.save(pedido);
        enviarMensajeCliente(pedido.id,  "canceladoResponse", "El pedido no ha podido ser confirmado por nuestros administradores. Por favor, realice un nuevo pedido.");
      }
  
    //   console.log(`Checked and canceled ${pedidosToCancel.length} pedidos.`);
    }
  
    // Schedule the job to run every minute
    cron.schedule('* * * * *', async () => {
      await cancelSolicitadoPedidos();
    //   console.log('Scheduled job "cancelSolicitadoPedidos" executed.');
    });
  };