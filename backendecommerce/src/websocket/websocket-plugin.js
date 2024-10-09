const setupWebSocket = require("./websocket");

module.exports = {
  load: (container) => {
    const server = container.resolve("expressApp");
    setupWebSocket(server);
  },
};