import { app } from "@/app";
import { env } from "@/config/env";
import { closeMySqlPool } from "@/database/mysql";
import { testMySqlConnection } from "@/database/test-connection";

let server: ReturnType<typeof app.listen> | null = null;
let isShuttingDown = false;

const shutdown = async (signal: string) => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  console.log(`Received ${signal}, shutting down...`);

  try {
    const activeServer = server;

    if (activeServer) {
      await new Promise<void>((resolve, reject) => {
        activeServer.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    }

    await closeMySqlPool();
    console.log("Shutdown completed.");
    process.exit(0);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Shutdown failed.";
    console.error(message);
    process.exit(1);
  }
};

const startServer = async () => {
  try {
    await testMySqlConnection();

    server = app.listen(env.PORT, () => {
      console.log(`Backend listening on port ${env.PORT}`);
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start backend.";
    console.error(message);
    await closeMySqlPool();
    process.exit(1);
  }
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

void startServer();
