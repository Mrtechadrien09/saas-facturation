import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valide les données entrantes par rapport au schéma passé en paramètre
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Renvoie une erreur 400 propre avec la liste des champs incorrects
        return res.status(400).json({
          success: false,
          message: "Données de requête invalides.",
          errors: error.errors.map((err) => ({
            field: err.path.join('.').replace('body.', ''), // Nettoie le chemin pour le rendre lisible
            message: err.message,
          })),
        });
      }
      return next(error);
    }
  };
};