/**
 * Custom error types for better error handling across the application
 */

export class AppError extends Error {
  public readonly code?: string;
  public readonly statusCode?: number;

  constructor(message: string, code?: string, statusCode?: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export class AuthError extends AppError {
  constructor(message: string, code?: string) {
    super(message, code, 401);
    this.name = 'AuthError';
  }
}

export class NetworkError extends AppError {
  constructor(message = 'Network request failed') {
    super(message, 'NETWORK_ERROR', 503);
    this.name = 'NetworkError';
  }
}

export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Helper to wrap errors in a consistent format
 */
export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  
  if (error instanceof Error) {
    return new AppError(error.message);
  }
  
  return new AppError('An unexpected error occurred');
}

/**
 * Format error message for display to users
 */
export function formatErrorMessage(error: unknown): string {
  const appError = handleError(error);
  return appError.message;
}
