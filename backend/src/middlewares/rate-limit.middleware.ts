import type { Request, Response } from "express";
import rateLimit from "express-rate-limit";

const createRateLimitHandler =
  (message: string, code: string) =>
  (_req: Request, res: Response) => {
    return res.status(429).json({
      success: false,
      message,
      error: {
        code,
      },
    });
  };

export const publicLeadSubmissionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    "Too many lead submissions. Please try again later.",
    "RATE_LIMIT_EXCEEDED",
  ),
});

export const adminLoginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: createRateLimitHandler(
    "Too many login attempts. Please try again later.",
    "RATE_LIMIT_EXCEEDED",
  ),
});
