import type { NextFunction, Request, Response } from "express";

import { env } from "@/config/env";
import { AppError } from "@/errors/app-error";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const logErrorChain = (error: unknown, label = "error", depth = 0) => {
  const indent = "  ".repeat(depth);

  console.error(`${indent}${label}:`, error);

  if (error instanceof Error && error.stack) {
    console.error(`${indent}${label}.stack:`);
    console.error(error.stack);
  }

  if (error instanceof Error && "cause" in error && error.cause) {
    console.error(`${indent}${label}.cause:`);
    logErrorChain(error.cause, "cause", depth + 1);
  }

  if (isRecord(error) && "response" in error) {
    const response = error.response as Record<string, unknown> | undefined;

    if (response) {
      console.error(`${indent}${label}.response.status:`, response.status);
      console.error(`${indent}${label}.response.data:`, response.data);
      console.error(`${indent}${label}.config.url:`, error.config && isRecord(error.config) ? error.config.url : undefined);
    }
  }
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error("Express error handler caught an error");
  logErrorChain(error);

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
    message:
      isDevelopment && error instanceof Error
        ? error.message
        : "Internal server error",
    error: {
      code: "INTERNAL_SERVER_ERROR",
      details: isDevelopment && error instanceof Error ? error.message : undefined,
    },
  });
};
