export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Maintenir la chaîne de prototype pour instanceof
    Object.setPrototypeOf(this, AppError.prototype);

    // Capturer la stacktrace
    Error.captureStackTrace(this, this.constructor);
  }
}

// Erreurs courantes
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} non trouvé(e)`, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Non autorisé') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Accès refusé') {
    super(message, 403);
  }
}

export class ConflictError extends AppError {
  constructor(resource: string) {
    super(`${resource} existe déjà`, 409);
  }
}
