import { Application } from "./app";
import { testConnection, closeConnection } from "./db";

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

async function startServer() {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error("❌ Failed to connect to database. Exiting...");
      process.exit(1);
    }

    // Create Express application
    const app = Application();

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📁 Static files: http://localhost:${PORT}/uploads`);
      console.log(`🗄️  Database: Connected`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`${signal} received, shutting down gracefully`);

      server.close(async () => {
        console.log("HTTP server closed");

        try {
          await closeConnection();
          console.log("Database connection closed");
        } catch (error) {
          console.error("Error closing database connection:", error);
        }

        console.log("Process terminated");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
