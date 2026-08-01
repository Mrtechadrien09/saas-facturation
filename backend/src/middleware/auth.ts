import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import  dotenv  from 'dotenv';

dotenv.config();
// On étend le type de Request d'Express pour pouvoir y stocker l'ID de l'utilisateur
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // 1. Récupérer le token dans l'en-tête "Authorization" (Format: Bearer <token>)
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: "Accès refusé. Token manquant." });
    }

    const token = authHeader.split(' ')[1];

    // 2. Vérifier le token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("❌ Erreur : JWT_SECRET n'est pas défini dans le fichier .env");
      return res.status(500).json({ success: false, message: "Erreur de configuration serveur." });
    }
    const decoded = jwt.verify(token, jwtSecret) as { userId: string };

    // 3. Injecter les infos de l'utilisateur dans la requête pour les contrôleurs suivants
    req.user = { userId: decoded.userId };
    
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalide ou expiré." });
  }
};

