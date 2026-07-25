import type { Request, Response } from "express";
import rateLimit from "express-rate-limit";

export const publicLeadSubmissionRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    keyGeneratorIpFallback: false,
  },
  keyGenerator: (req: Request) =>
    req.ip || req.socket.remoteAddress || "unknown",
  handler: (_req: Request, res: Response) => {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
});

export const adminLoginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  validate: {
    keyGeneratorIpFallback: false,
  },
  keyGenerator: (req: Request) =>
    req.ip || req.socket.remoteAddress || "unknown",
  handler: (_req: Request, res: Response) => {
    return res.status(429).json({
      success: false,
      message: "Too many requests. Please try again later.",
    });
  },
});
