/**
 * Centralized error handling utilities
 * Provides consistent error types and handling across the application
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, unknown>
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, "VALIDATION_ERROR", 400, context);
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = "Unauthorized", context?: Record<string, unknown>) {
    super(message, "AUTHENTICATION_ERROR", 401, context);
    this.name = "AuthenticationError";
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = "Rate limit exceeded", context?: Record<string, unknown>) {
    super(message, "RATE_LIMIT_ERROR", 429, context);
    this.name = "RateLimitError";
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Resource not found", context?: Record<string, unknown>) {
    super(message, "NOT_FOUND", 404, context);
    this.name = "NotFoundError";
  }
}

export class PayloadTooLargeError extends AppError {
  constructor(message: string = "Payload too large", context?: Record<string, unknown>) {
    super(message, "PAYLOAD_TOO_LARGE", 413, context);
    this.name = "PayloadTooLargeError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
