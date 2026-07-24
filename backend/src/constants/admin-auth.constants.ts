import { env } from "@/config/env";

export const ADMIN_SESSION_COOKIE_NAME = env.COOKIE_NAME;
export const ADMIN_SESSION_DURATION_MS =
  env.SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;
export const ADMIN_PASSWORD_SALT_ROUNDS = 12;
