import {
  ProductService,
  ConfigModule,
  MedusaContainer,
} from "@medusajs/medusa";
import WebSocket from "ws";


export const ubicacionesDelivery = new Map<string, { lat: number, lng: number, pedidoId: string | null }>();
const entregados = new Set<string>();
export default async (
  container: MedusaContainer,
  config: ConfigModule
): Promise<void> => {
  console.info("Iniciando WebSocket loader...");

  // Your WebSocket server setup
  const port = 9001;

  const wss = new WebSocket.Server({
    port: port,
  });


  wss.on("connection", (ws, req) => {
    console.info("New WebSocket connection established");

    // Basic authentication (for demonstration purposes)
    const params = new URLSearchParams(req.url?.split('?')[1]);
    const rol = params.get('rol'); // Si es delivery o cliente
    const id = params.get('id');

    if (id && rol === 'delivery') {
      ubicacionesDelivery.set(id, { lat: 0, lng: 0, pedidoId: null });
    }

    if (!rol || !id) {
      ws.send(JSON.stringify({ error: 'Parámetros incorrectos' }));
      ws.close();
      return;
    }

    ws.on("message", (message) => {
      console.info(`Received message from ${rol} (${id}): ${message}`);
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message.toString()); // Convert RawData to string
      } catch (error) {
        console.error(`Error parsing message: ${error}`);
        ws.send(JSON.stringify({ error: 'Error parsing message' }));
        return;
      }
    
      // Handle messages based on role
      if (rol === 'delivery') {
        handleDeliveryMessage(ws, parsedMessage, id, ubicacionesDelivery);
      } else if (rol === 'cliente') {
        handleClientMessage(ws, parsedMessage, id, ubicacionesDelivery);
      }
    });

    ws.on("close", () => {
      if (id) {
        console.info(`WebSocket connection closed for user ${id}`);
        if (rol === 'delivery') {
          ubicacionesDelivery.delete(id);
          console.info(`Se eliminó al repartidor ${id} de la lista de ubicaciones`);
        }
      } else {
        console.info('WebSocket connection closed');
      }
    });
    ws.send(JSON.stringify({ message: `Welcome ${rol} (${id}) to the WebSocket server!` }));
  });



  console.info(`WebSocket server is listening on port ${port}`);
  console.info("Ending WebSocket loader...");
};

// Handle messages from delivery personnel
const handleDeliveryMessage = (
  ws: WebSocket,
  message: any,
  userId: string,
  deliveryLocations: Map<string, { lat: number, lng: number, pedidoId: string | null }>
) => {
  console.info(`Received message from delivery ${userId}: ${JSON.stringify(message)}`);
  switch (message.type) {
    case 'ubicacion':
      const currentData = deliveryLocations.get(userId) || { lat: 0, lng: 0, pedidoId: null };
      deliveryLocations.set(userId, { ...currentData, ...message.data });
      break;
    case 'entrega':
      console.info(`Entrega realizada por ${userId}: ${JSON.stringify(message.data)}`);
      const pedidoEntregado = message.data.pedidoId;
      if (pedidoEntregado) {
        entregados.add(pedidoEntregado);
      }
      break;
    default:
      console.warn(`Unknown message type from delivery: ${message.type}`);
  }
  console.info(`Ubicaciones de repartidores: ${JSON.stringify(Array.from(deliveryLocations.entries()))}`);
};

// Handle messages from clients
const handleClientMessage = (
  ws: WebSocket,
  message: any,
  idPedido: string,
  deliveryLocations: Map<string, { lat: number, lng: number, pedidoId: string | null }>
) => {
  switch (message.type) {
    case 'ubicacion':
      // console.info(`Client location request: ${JSON.stringify(message.data)}`);
      // Retrieve the location of the requested delivery person
      const deliveryId = message.data.deliveryId;
      const location = deliveryLocations.get(deliveryId);
      const enEntrega = location?.pedidoId === idPedido;
      const entregado = entregados.has(idPedido);
      if (entregado) {
        console.info(`Pedido ${idPedido} ya fue entregado`);
        ws.send(JSON.stringify({ type: 'entregadoResponse', data: 'Pedido entregado' }));
        entregados.delete(idPedido);
      } else if (location && enEntrega) {
        ws.send(JSON.stringify({ type: 'locationResponse', data: location }));
      } 
      else if (location && !enEntrega) {
        ws.send(JSON.stringify({ type: 'notYetResponse', data: 'Repartidor atendiendo otros pedido' }));
      } 
      else {
        ws.send(JSON.stringify({ type: 'error', error: 'Location not found' }));
      }
      break;
    case 'orderQuery':
      console.info(`Client order query: ${JSON.stringify(message.data)}`);
      // Handle order query
      break;
    case 'supportRequest':
      console.info(`Client support request: ${JSON.stringify(message.data)}`);
      // Handle support request
      break;
    default:
      console.warn(`Unknown message type from client: ${message.type}`);
  }
};