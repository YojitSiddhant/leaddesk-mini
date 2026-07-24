import type { Request, Response } from "express";

import { getHealthStatus } from "@/services/health.service";

export const getHealth = async (_req: Request, res: Response) => {
  const healthStatus = await getHealthStatus();
  const isDatabaseConnected = healthStatus.database === "connected";
  const message = isDatabaseConnected
    ? "LeadDesk Mini API is healthy"
    : "Database unavailable";

  res.status(isDatabaseConnected ? 200 : 503).json({
    success: isDatabaseConnected,
    message,
    error: isDatabaseConnected
      ? undefined
      : {
          code: "DATABASE_UNAVAILABLE",
        },
    data: healthStatus,
  });
};
