import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

console.log({
  DB_PORT: process.env.DB_PORT,
  MYSQLPORT: process.env.MYSQLPORT,
});

const envSchema = z.object({
  PORT: z.coerce.number().int().positive(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  DB_HOST: z.string().min(1),
  DB_PORT: z.coerce.number().int().positive(),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().default(""),
  DB_NAME: z.string().min(1),
  DB_CONNECTION_LIMIT: z.coerce.number().int().positive(),
  FRONTEND_URL: z.string().url(),
  SESSION_SECRET: z.string().min(16),
  COOKIE_NAME: z.string().min(1),
  SESSION_DURATION_DAYS: z.coerce.number().int().positive(),
});

const dbPortValue = (() => {
  const directDbPort = process.env.DB_PORT?.trim();

  if (directDbPort && Number.isFinite(Number(directDbPort))) {
    return directDbPort;
  }

  const railwayMySqlPort = process.env.MYSQLPORT?.trim();

  if (railwayMySqlPort && Number.isFinite(Number(railwayMySqlPort))) {
    return railwayMySqlPort;
  }

  return directDbPort ?? railwayMySqlPort;
})();

const parsedEnv = envSchema.safeParse({
  ...process.env,
  DB_PORT: dbPortValue,
});

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".") || "env"}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment configuration:\n${formattedErrors}`);
}

export const env = parsedEnv.data;
