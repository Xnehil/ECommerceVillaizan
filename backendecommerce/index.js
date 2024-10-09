const express = require("express")
const { GracefulShutdownServer } = require("medusa-core-utils");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const setupWebSocket = require("./src/websocket");

const loaders = require("@medusajs/medusa/dist/loaders/index").default

;(async() => {
  async function start() {
    const app = express()
    const directory = process.cwd()

    try {
      const { container } = await loaders({
        directory,
        expressApp: app
      })
      const configModule = container.resolve("configModule")
      const port = process.env.PORT ?? configModule.projectConfig.port ?? 9000

      const server = GracefulShutdownServer.create(
        app.listen(port, (err) => {
          if (err) {
            return
          }
          console.log(`Server is ready on port: ${port}`)
        })
      )

      const wss =setupWebSocket(server  )

      // const swaggerDocs = swaggerJSDoc(swaggerOptions)
      // fs.writeFileSync('./swagger-output.json', JSON.stringify(swaggerDocs, null, 2), 'utf-8')
      // console.log('Swagger JSON has been generated and saved to swagger-output.json')


      // Handle graceful shutdown
      const gracefulShutDown = () => {
        server
          .shutdown()
          .then(() => {
            console.info("Gracefully stopping the server.")
            process.exit(0)
          })
          .catch((e) => {
            console.error("Error received when shutting down the server.", e)
            process.exit(1)
          })
      }
      process.on("SIGTERM", gracefulShutDown)
      process.on("SIGINT", gracefulShutDown)
    } catch (err) {
      console.error("Error starting server", err)
      process.exit(1)
    }
  }

  await start()
})()
