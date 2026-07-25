import { app } from "@/app";
import { env } from "@/config/env";
import { ensureDatabaseExists } from "@/database/ensure-database";
import { closeMySqlPool } from "@/database/mysql";
import { testMySqlConnection } from "@/database/test-connection";
import { runDatabaseMigrations } from "@/database/migration-runner";

let server: ReturnType<typeof app.listen> | null = null;
let isShuttingDown = false;
const STARTUP_RETRY_ATTEMPTS = 5;
const STARTUP_RETRY_DELAY_MS = 2000;

const wait = async (milliseconds: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });

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
  for (let attempt = 1; attempt <= STARTUP_RETRY_ATTEMPTS; attempt += 1) {
    try {
      await ensureDatabaseExists();
      await testMySqlConnection();
      await runDatabaseMigrations();

      server = app.listen(env.PORT, "0.0.0.0", () => {
        console.log(`Backend listening on 0.0.0.0:${env.PORT}`);
      });

      return;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to start backend.";

      console.error(
        `Startup attempt ${attempt} of ${STARTUP_RETRY_ATTEMPTS} failed: ${message}`,
      );

      if (attempt < STARTUP_RETRY_ATTEMPTS) {
        await wait(STARTUP_RETRY_DELAY_MS);
        continue;
      }

      await closeMySqlPool();
      process.exit(1);
    }
  }
};

process.on("SIGINT", () => {
  void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
  void shutdown("SIGTERM");
});

void startServer();
