import {
    ConfigModule,
    MedusaContainer,
  } from "@medusajs/medusa";
  import cron from 'node-cron';
  import { IsNull, LessThan, LessThanOrEqual } from 'typeorm';
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
        where: [
          {
              estado: 'solicitado',
              solicitadoEn: LessThanOrEqual(thresholdDate),
          },
          {
              estado: 'solicitado',
              solicitadoEn: IsNull(),
          },
      ],
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
        // console.log("Scheduled job 'validarPromociones' started.");
        
        const detallePedidoRepository = container.resolve('detallepedidoRepository');
        const promocionRepository = container.resolve('promocionRepository');
        const productoRepository = container.resolve('productoRepository');
    
        const promociones: Promocion[] = await promocionRepository.find({ where: { esValido: true } });
        const now = new Date();
    
        const updatedDetalles = [];  // Colección de detalles de pedido que se actualizarán
    
        for (const promocion of promociones) {
          const fechaExpiracion = new Date(promocion.fechaFin);
          
          if (fechaExpiracion <= now) {
            console.log(`Promotion ${promocion.id} has expired.`);
            promocion.esValido = false;
    
            const detallesPedido = await detallePedidoRepository.encontrarDetallesPedidoPorPromocionYCarrito(promocion.id);
            detallesPedido.forEach(detalle => {
              detalle.promocion = null;
              detalle.precio = detalle.producto.precioEcommerce;
              detalle.subtotal = detalle.cantidad * detalle.producto.precioEcommerce;
              updatedDetalles.push(detalle);
            });
    
            await promocionRepository.save(promocion);
          }
        }
    
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
    cron.schedule('*/5 * * * *', async () => {
      await validarPromociones();
      // console.log('Scheduled job "validarPromociones" executed.');
    });
  };