import mysql, { type Pool } from "mysql2/promise";

import { env } from "@/config/env";

let pool: Pool | null = null;

const createPool = () =>
  mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: env.DB_CONNECTION_LIMIT,
    queueLimit: 0,
  });

export const getMySqlPool = () => {
  if (!pool) {
    pool = createPool();
  }

  return pool;
};

export const closeMySqlPool = async () => {
  if (!pool) {
    return;
  }

  await pool.end();
  pool = null;
};
