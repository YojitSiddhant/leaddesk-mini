import { createHmac, randomBytes } from "crypto";

import { env } from "@/config/env";

export const generateSessionToken = () => randomBytes(32).toString("base64url");

export const hashSessionToken = (sessionToken: string) =>
  createHmac("sha256", env.SESSION_SECRET).update(sessionToken).digest("hex");
