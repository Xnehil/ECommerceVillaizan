const express = require("express");
const { GracefulShutdownServer } = require("medusa-core-utils");
const setupWebSocket = require("./src/websocket/index.js");

const loaders = require("@medusajs/medusa/dist/loaders/index").default;

(async () => {
  async function start() {
    const app = express();
    const directory = process.cwd();
    console.log("Starting server... with directory", directory);
    try {
      const { container } = await loaders({
        directory,
        expressApp: app,
      });
      const configModule = container.resolve("configModule");
      const port = process.env.PORT ?? configModule.projectConfig.port ?? 9000;

      // Start the HTTP server
      console.log("Starting HTTP server...");
      const server = app.listen(port, (err) => {
        if (err) {
          console.error("Error starting HTTP server", err);
          return;
        }
        console.log(`HTTP Server is ready on port: ${port}`);

        // WebSocket setup (after HTTP server starts)
        console.log("Setting up WebSocket...");
        setupWebSocket(server);
        console.log("WebSocket setup complete.");
      });

      // Wrap server with graceful shutdown
      const gracefulServer = GracefulShutdownServer.create(server);

      // Handle graceful shutdown
      const gracefulShutDown = () => {
        gracefulServer
          .shutdown()
          .then(() => {
            console.info("Gracefully stopping the server.");
            process.exit(0);
          })
          .catch((e) => {
            console.error("Error received when shutting down the server.", e);
            process.exit(1);
          });
      };

      process.on("SIGTERM", gracefulShutDown);
      process.on("SIGINT", gracefulShutDown);
    } catch (err) {
      console.error("Error starting server", err);
      process.exit(1);
    }
  }

  await start();
})();
