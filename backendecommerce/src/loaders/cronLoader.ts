import {
    ConfigModule,
    MedusaContainer,
  } from "@medusajs/medusa";
  import cron from 'node-cron';
  import { LessThan } from 'typeorm';
  import { Pedido } from '@models/Pedido';
  import AjusteService from '@services/Ajuste';
import { enviarMensajeCliente } from "./websocketLoader";
import { Promocion } from "@models/Promocion";
  
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
        enviarMensajeCliente(pedido.id,  "canceladoResponse", "El pedido no ha podido ser confirmado por nuestros administradores.");
      }
  
    //   console.log(`Checked and canceled ${pedidosToCancel.length} pedidos.`);
    }

    async function validarPromociones() {
      try {
        console.log("Scheduled job 'validarPromociones' started.");
          const detallePedidoRepository = container.resolve('detallepedidoRepository');
          const promocionRepository = container.resolve('promocionRepository');
          const promociones: Promocion[] = await promocionRepository.find({ where: { esValido: true } });
          const now = new Date();
  
          const updatedDetalles = [];  // Colección de detalles de pedido que se actualizarán
  
          for (const promocion of promociones) {
            const fechaExpiracion = new Date(promocion.fechaFin);
            // Solo desactivar promociones que ya han expirado
            if (fechaExpiracion <= now) {
              promocion.esValido = false;
              // Encontrar detalles de pedido asociados a la promoción y quitar la referencia
              const detallesPedido = await detallePedidoRepository.encontrarDetallesPedidoPorPromocionYCarrito(promocion.id);
              for (const detalle of detallesPedido) {
                  detalle.promocion = null;
                  updatedDetalles.push(detalle);
              }
  
              // Guardar promoción actualizada
              await promocionRepository.save(promocion);
            }
          }
  
          // Guardar detalles actualizados
          if (updatedDetalles.length > 0) {
              await detallePedidoRepository.save(updatedDetalles);
          }
          console.log('Scheduled job "validarPromociones" finished.');
      } catch (error) {
          console.error('Error validating promotions:', error);
      }
    }
    // Schedule the job to run every minute
    cron.schedule('* * * * *', async () => {
      await cancelSolicitadoPedidos();
    //   console.log('Scheduled job "cancelSolicitadoPedidos" executed.');
    });
    //'*/5 * * * *'
    cron.schedule('* * * * *', async () => {
      await validarPromociones();
      // console.log('Scheduled job "validarPromociones" executed.');
    });
  };