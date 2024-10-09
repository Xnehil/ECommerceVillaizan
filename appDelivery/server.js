// server.js

const WebSocket = require('ws');

// Crear el servidor WebSocket en el puerto 8080
const wss = new WebSocket.Server({ port: 8080 });

// Función que se ejecuta cuando un cliente se conecta al servidor
wss.on('connection', (ws) => {
  console.log('Cliente conectado');

  // Función que se ejecuta cuando el servidor recibe un mensaje de un cliente
  ws.on('message', (message) => {
    console.log(`Mensaje recibido del cliente: ${message}`);

    // Enviar un mensaje de vuelta al cliente
    ws.send(`Echo: ${message}`);
    
    // Enviar el mensaje a todos los clientes conectados (broadcast)
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(`Broadcast: ${message}`);
      }
    });
  });

  // Función que se ejecuta cuando el cliente se desconecta
  ws.on('close', () => {
    console.log('Cliente desconectado');
  });
});

console.log('Servidor WebSocket corriendo en ws://localhost:8080');
