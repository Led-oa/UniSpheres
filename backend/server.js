const app = require("./app");
const { pool } = require("./src/config/database");
const { initSockets } = require("./src/socket/index.socket");

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});

// Initialiser Socket.IO
initSockets(server);

const gracefulShutdown = async (signal) => {
  console.log(`\n👋 ${signal} received. Initiating shutdown...`);
  server.close(async (err) => {
    if (err) {
      console.error("❌ Error during server close:", err);
      process.exit(1);
    }
    console.log("✅ HTTP server closed.");
    try {
      await pool.end();
      console.log("✅ Database pool closed.");
      process.exit(0);
    } catch (dbError) {
      console.error("❌ Error closing database pool:", dbError);
      process.exit(1);
    }
  });
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("uncaughtException", (error) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION at:", promise, "reason:", reason);
  process.exit(1);
});
