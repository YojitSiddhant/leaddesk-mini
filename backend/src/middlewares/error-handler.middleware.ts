import type { NextFunction, Request, Response } from "express";

import { env } from "@/config/env";
import { AppError } from "@/errors/app-error";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: {
        code: error.code,
        details: error.details,
      },
    });
  }

  const isDevelopment = env.NODE_ENV === "development";

  return res.status(500).json({
    success: false,
    message: "Internal server error",
    error: {
      code: "INTERNAL_SERVER_ERROR",
      details: isDevelopment && error instanceof Error ? error.message : undefined,
    },
  });
};
