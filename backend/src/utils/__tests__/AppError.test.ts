import { AppError, NotFoundError, ValidationError, ConflictError } from '../utils/AppError';

describe('AppError Classes', () => {
  describe('AppError', () => {
    it('should create an error with message and status code', () => {
      const error = new AppError('Test error', 400);
      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.isOperational).toBe(true);
    });

    it('should have a default status code of 500', () => {
      const error = new AppError('Server error');
      expect(error.statusCode).toBe(500);
    });

    it('should be an instance of Error', () => {
      const error = new AppError('Test');
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
    });
  });

  describe('NotFoundError', () => {
    it('should create a 404 error with resource name', () => {
      const error = new NotFoundError('Facture');
      expect(error.message).toBe('Facture non trouvé(e)');
      expect(error.statusCode).toBe(404);
    });
  });

  describe('ValidationError', () => {
    it('should create a 400 error for validation', () => {
      const error = new ValidationError('Email invalide');
      expect(error.message).toBe('Email invalide');
      expect(error.statusCode).toBe(400);
    });
  });

  describe('ConflictError', () => {
    it('should create a 409 error for conflicts', () => {
      const error = new ConflictError('Utilisateur');
      expect(error.message).toBe('Utilisateur existe déjà');
      expect(error.statusCode).toBe(409);
    });
  });
});
