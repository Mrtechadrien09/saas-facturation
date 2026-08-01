import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import apiRouter from './routes/index.js';
import logger from './utils/logger.js';
import { swaggerSpec } from './config/swagger.js';
import { AppError } from './utils/AppError.js';

// Chargement des variables d'environnement
dotenv.config();

const app = express();

// Middlewares globaux
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Middleware de logging des requêtes
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(`${req.method} ${req.path}`, { 
    ip: req.ip, 
    userAgent: req.get('user-agent') 
  });
  next();
});

// Documentation Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { 
  swaggerOptions: { 
    persistAuthorization: true 
  } 
}));

// Connexion sécurisée à MongoDB Atlas
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  logger.error("❌ Erreur : MONGO_URI n'est pas défini dans le fichier .env");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => logger.info("🍃 Connexion réussie à MongoDB Atlas !"))
  .catch((err) => {
    logger.error("❌ Échec de la connexion à MongoDB :", err);
    process.exit(1);
  });

// --- Point d'entrée unique de l'API ---
app.use('/api', apiRouter);

// Route de base pour vérifier la santé du serveur
app.get('/', (req, res) => {
  res.json({ 
    status: "Le serveur Assalio est en ligne !",
    docs: "http://localhost:5000/api/docs"
  });
});

// 404 Handler
app.use((req, res, next) => {
  next(new AppError(`Route ${req.path} non trouvée`, 404));
});

// Middleware global de gestion des erreurs
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur serveur interne';

  logger.error(`[${statusCode}] ${message}`, { 
    path: req.path, 
    method: req.method, 
    stack: err.stack 
  });

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`🚀 Serveur démarré sur : http://localhost:${PORT}`);
  logger.info(`📚 Documentation disponible sur : http://localhost:${PORT}/api/docs`);
});

export default app;