import mysql from "mysql2/promise";

import { env } from "@/config/env";

const escapeIdentifier = (value: string) => `\`${value.replace(/`/g, "``")}\``;

export const ensureDatabaseExists = async () => {
  const bootstrapPool = mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 1,
    queueLimit: 0,
  });

  try {
    await bootstrapPool.query(
      `CREATE DATABASE IF NOT EXISTS ${escapeIdentifier(env.DB_NAME)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );

    console.log(`Ensured database exists: ${env.DB_NAME}`);
  } catch (error) {
    console.error("Failed to ensure database exists");
    console.error(error);

    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }

    throw error;
  } finally {
    await bootstrapPool.end();
  }
};
