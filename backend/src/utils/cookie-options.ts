import type { CookieOptions } from "express";

import { env } from "@/config/env";
import { ADMIN_SESSION_DURATION_MS } from "@/constants/admin-auth.constants";

const isProduction = env.NODE_ENV === "production";

export const getAdminSessionCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction,
  maxAge: ADMIN_SESSION_DURATION_MS,
  path: "/",
});

export const getAdminSessionClearCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  sameSite: "lax",
  secure: isProduction,
  path: "/",
});
