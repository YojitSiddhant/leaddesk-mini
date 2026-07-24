export class AppError extends Error {
  public readonly statusCode: number;

  public readonly isOperational: boolean;

  public readonly code: string;

  public readonly details?: unknown;

  constructor(
    message: string,
    statusCode = 500,
    isOperational = true,
    code?: string,
    details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code ?? "APP_ERROR";
    this.details = details;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
