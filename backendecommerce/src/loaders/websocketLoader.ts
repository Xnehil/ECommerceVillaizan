import {
  ProductService,
  ConfigModule,
  MedusaContainer,
} from "@medusajs/medusa";
import WebSocket from "ws";


export const ubicacionesDelivery = new Map<string, { lat: number, lng: number }>();
export default async (
  container: MedusaContainer,
  config: ConfigModule
): Promise<void> => {
  console.info("Iniciando WebSocket loader...");

  // Your WebSocket server setup
  const port = 9001;

  const wss = new WebSocket.Server({
    port: port,
    path: "/ws",
  });


  wss.on("connection", (ws, req) => {
    console.info("New WebSocket connection established");

    // Basic authentication (for demonstration purposes)
    const params = new URLSearchParams(req.url?.split('?')[1]);
    const rol = params.get('rol'); // Si es delivery o cliente
    const id = params.get('id');

    if (!rol || !id) {
      ws.send(JSON.stringify({ error: 'Parámetros incorrectos' }));
      ws.close();
      return;
    }

    ws.on("message", (message) => {
      console.info(`Received message from ${rol} (${id}): ${message}`);
      let parsedMessage;
      try{
        parsedMessage = JSON.parse(message);
      } catch (error) {
        console.error(`Error parsing message: ${error}`);
        ws.send(JSON.stringify({ error: 'Error parseando mensaje' }));
        return;
      }

      // Handle messages based on role
      if (rol === 'delivery') {
        handleDeliveryMessage(ws, parsedMessage, id, ubicacionesDelivery);
      } else if (rol === 'cliente') {
        handleClientMessage(ws, parsedMessage, ubicacionesDelivery);
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
  deliveryLocations: Map<string, { lat: number, lng: number }>
) => {
  switch (message.type) {
    case 'ubicacion':
      console.info(`Actualización de ubicación de ${userId}: ${JSON.stringify(message.data)}`);
      // Update the location in the map
      deliveryLocations.set(userId, message.data);
      break;
    case 'orderStatus':
      console.info(`Order status update from ${userId}: ${JSON.stringify(message.data)}`);
      // Handle order status update
      break;
    default:
      console.warn(`Unknown message type from delivery: ${message.type}`);
  }
};

// Handle messages from clients
const handleClientMessage = (
  ws: WebSocket,
  message: any,
  deliveryLocations: Map<string, { lat: number, lng: number }>
) => {
  switch (message.type) {
    case 'ubicacion':
      console.info(`Client location request: ${JSON.stringify(message.data)}`);
      // Retrieve the location of the requested delivery person
      const deliveryId = message.data.deliveryId;
      const location = deliveryLocations.get(deliveryId);
      if (location) {
        ws.send(JSON.stringify({ type: 'locationResponse', data: location }));
      } else {
        ws.send(JSON.stringify({ type: 'locationResponse', error: 'Location not found' }));
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