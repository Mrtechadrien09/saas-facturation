import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

export const requireAuth: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;

    const authHeader = authReq.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: "Accès refusé. Token manquant." });
    }

    const token = authHeader.split(' ')[1];

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("❌ Erreur : JWT_SECRET n'est pas défini dans le fichier .env");
      return res.status(500).json({ success: false, message: "Erreur de configuration serveur." });
    }

    const decoded = jwt.verify(token, jwtSecret) as { userId: string };

    authReq.user = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token invalide ou expiré." });
  }
};

