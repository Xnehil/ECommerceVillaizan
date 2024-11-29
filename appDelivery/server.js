const WebSocket = require("ws");

// Puerto del servidor WebSocket
const PORT = 9002;

// Crear una instancia del servidor WebSocket
const wss = new WebSocket.Server({ port: PORT }, () => {
  console.log(`Servidor WebSocket iniciado en ws://localhost:${PORT}`);
});

// Función para enviar un mensaje de "nuevoPedido" a todos los clientes conectados
const sendNuevoPedido = () => {
  const message = {
    type: "nuevoPedido",
    data: {
      pedidoId: Math.random().toString(36).substr(2, 9), // Generar un ID aleatorio para el pedido
      timestamp: new Date().toISOString(),
    },
  };
  console.log("Mensaje enviado");
  // Enviar el mensaje a todos los clientes conectados
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
      console.log("Mensaje enviado:", message);
    }
  });
};

// Manejar la conexión de nuevos clientes
wss.on("connection", (ws) => {
  console.log("Nuevo cliente conectado");

  // Escuchar mensajes entrantes del cliente (si es necesario)
  ws.on("message", (message) => {
    console.log("Mensaje recibido del cliente:", message);
  });

  // Manejar la desconexión de clientes
  ws.on("close", () => {
    console.log("Cliente desconectado");
  });
});

// Enviar mensajes cada 10 segundos
setInterval(sendNuevoPedido, 10000);
