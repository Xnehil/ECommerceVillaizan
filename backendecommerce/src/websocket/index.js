const WebSocket = require("ws");

module.exports = function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server });

  wss.on("connection", (ws) => {
    console.log("WebSocket connection established");

    ws.on("message", (message) => {
      console.log("Received message:", message);
      ws.send("Hello from WebSocket server");
    });

    ws.on("close", () => {
      console.log("WebSocket connection closed");
    });
  });
};

