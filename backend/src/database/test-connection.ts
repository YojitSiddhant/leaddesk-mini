import type { PoolConnection } from "mysql2/promise";

import { getMySqlPool } from "@/database/mysql";

export const testMySqlConnection = async () => {
  const pool = getMySqlPool();
  let connection: PoolConnection | null = null;

  try {
    connection = await pool.getConnection();
    await connection.query("SELECT 1 AS connection_test");
    console.log("MySQL connection test succeeded.");
  } catch {
    throw new Error("Failed to connect to MySQL.");
  } finally {
    connection?.release();
  }
};

export const isMySqlAvailable = async () => {
  const pool = getMySqlPool();

  try {
    await pool.query("SELECT 1");
    return true;
  } catch {
    return false;
  }
};
