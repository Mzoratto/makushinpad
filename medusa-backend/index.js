const express = require("express")
const { GracefulShutdownServer } = require("medusa-core-utils")

const loaders = require("@medusajs/medusa/dist/loaders/index").default

;(async () => {
  async function start() {
    const app = express()
    const directory = process.cwd()

    try {
      const { container } = await loaders({
        directory,
        expressApp: app,
      })
      const configModule = container.resolve("configModule")
      const port = parseInt(process.env.PORT) || 9000
      const host = process.env.HOST || "0.0.0.0"

      const server = GracefulShutdownServer.create(
        app.listen(port, host, (err) => {
          if (err) {
            return
          }
          console.log(`🚀 Shin Shop Backend is ready at: http://${host}:${port}`)
          console.log(`📊 Admin Panel is ready at: http://localhost:7001`)
        })
      )

      // Handle graceful shutdown
      const gracefulShutDown = () => {
        server
          .shutdown()
          .then(() => {
            console.log("✅ Gracefully shut down")
            process.exit(0)
          })
          .catch((error) => {
            console.error("❌ Error during shutdown", error)
            process.exit(1)
          })
      }
      process.on("SIGTERM", gracefulShutDown)
      process.on("SIGINT", gracefulShutDown)
    } catch (err) {
      console.error("❌ Error starting server", err)
      process.exit(1)
    }
  }

  await start()
})()
