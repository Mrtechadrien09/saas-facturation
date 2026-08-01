import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // On valide ce qui arrive dans la requête (body, query, params)
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next(); // Tout est bon, on passe au controller !
    } catch (error) {
      if (error instanceof ZodError) {
        // Si Zod trouve des erreurs, on renvoie un statut 400 avec le détail
        return res.status(400).json({
          success: false,
          message: "Erreur de validation des données",
          errors: error.errors.map(err => ({
            field: err.path[1], // Le champ qui pose problème
            message: err.message
          }))
        });
      }
      return res.status(500).json({ success: false, message: "Erreur interne du serveur" });
    }
  };
};