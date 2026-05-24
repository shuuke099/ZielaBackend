import app from "./app";
import { env } from "./config/env";
import { logger } from "./core/logger";

// 🔴 Handle uncaught sync errors
process.on("uncaughtException", (err: Error) => {
  logger.error("UNCAUGHT EXCEPTION 💥", err.stack);
  process.exit(1);
});

// 🚀 Start server
const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Server running on port ${env.PORT}`);
});

// 🔴 Handle async errors
process.on("unhandledRejection", (err: any) => {
  logger.error("UNHANDLED REJECTION 💥", err?.stack || err);

  server.close(() => {
    process.exit(1);
  });
});

// 🟡 Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("👋 SIGTERM received. Shutting down gracefully...");

  server.close(() => {
    logger.info("💥 Process terminated!");
  });
});
