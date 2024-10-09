import {
  ProductService,
  ConfigModule,
  MedusaContainer,
} from "@medusajs/medusa";
import WebSocket from "ws";

export default async (
  container: MedusaContainer,
  config: ConfigModule
): Promise<void> => {
  console.info("Starting WebSocket loader...");

  // Your WebSocket server setup
  const port = 9001

  const wss = new WebSocket.Server({
    port: port,
    path: "/ws",
  });

  wss.on("connection", (ws) => {
    console.info("New WebSocket connection established");

    ws.on("message", (message) => {
      console.info(`Received message: ${message}`);
      // Handle incoming messages
    });

    ws.send("Welcome to the WebSocket server!");
  });


  console.info("Ending WebSocket loader...");
};
