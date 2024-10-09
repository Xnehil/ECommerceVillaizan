import WebSocket from 'ws';
import { Server } from 'http';

export const setupWebSocket = (server: Server) => {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
      console.log(`Received message: ${message}`);
      // Handle incoming messages
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });

    ws.send('Welcome to the WebSocket server!');
  });

  return wss;
};