import { readdir, readFile } from "fs/promises";
import path from "path";

import type { PoolConnection, RowDataPacket } from "mysql2/promise";

import { getMySqlPool } from "@/database/mysql";
import { verifyLeadsTableSchema } from "@/database/verify-leads-schema";

type SchemaMigrationRow = RowDataPacket & {
  filename: string;
};

const MIGRATIONS_DIR = path.resolve(__dirname, "../../database/migrations");

const SCHEMA_MIGRATIONS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS schema_migrations (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_schema_migrations_filename (filename)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const logMysqlError = (prefix: string, error: unknown) => {
  console.error(prefix);
  console.error(error);

  if (error instanceof Error && error.stack) {
    console.error(error.stack);
  }

  if (typeof error === "object" && error !== null) {
    const mysqlError = error as {
      code?: unknown;
      errno?: unknown;
      sqlState?: unknown;
      sqlMessage?: unknown;
    };

    console.error({
      code: mysqlError.code,
      errno: mysqlError.errno,
      sqlState: mysqlError.sqlState,
      sqlMessage: mysqlError.sqlMessage,
    });
  }
};

export const runDatabaseMigrations = async () => {
  const pool = getMySqlPool();
  let connection: PoolConnection | null = null;

  try {
    connection = await pool.getConnection();

    const [databaseRows] = await connection.query<RowDataPacket[]>(
      "SELECT DATABASE() AS databaseName",
    );
    console.log("Current database:");
    console.log(databaseRows);

    const migrationFileNames = (await readdir(MIGRATIONS_DIR))
      .filter((fileName) => fileName.endsWith(".sql"))
      .sort();

    console.log("Migrations discovered:");
    console.log(migrationFileNames);

    await connection.query(SCHEMA_MIGRATIONS_TABLE_SQL);

    const [appliedRows] = await connection.query<SchemaMigrationRow[]>(
      "SELECT filename FROM schema_migrations ORDER BY filename ASC",
    );
    const appliedMigrationNames = new Set(
      appliedRows.map((row) => row.filename),
    );

    console.log("Migrations already applied:");
    console.log(appliedRows.map((row) => row.filename));

    const appliedThisRun: string[] = [];
    const skippedThisRun: string[] = [];

    for (const migrationFileName of migrationFileNames) {
      if (appliedMigrationNames.has(migrationFileName)) {
        skippedThisRun.push(migrationFileName);
        console.log(`Skipping migration: ${migrationFileName}`);
        continue;
      }

      const migrationPath = path.join(MIGRATIONS_DIR, migrationFileName);
      const migrationSql = (await readFile(migrationPath, "utf8")).trim();

      if (!migrationSql) {
        throw new Error(`Migration file is empty: ${migrationFileName}`);
      }

      console.log(`Applying migration: ${migrationFileName}`);

      try {
        await connection.query(migrationSql);
        await connection.query(
          "INSERT INTO schema_migrations (filename) VALUES (?)",
          [migrationFileName],
        );

        appliedThisRun.push(migrationFileName);
        console.log(`Applied migration: ${migrationFileName}`);
      } catch (error) {
        logMysqlError(`Migration failed: ${migrationFileName}`, error);
        throw error;
      }
    }

    console.log("Migrations applied:");
    console.log(appliedThisRun);
    console.log("Migrations skipped:");
    console.log(skippedThisRun);

    await verifyLeadsTableSchema();
  } catch (error) {
    logMysqlError("Database migration runner failed", error);
    throw error;
  } finally {
    connection?.release();
  }
};
