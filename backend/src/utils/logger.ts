import winston from 'winston';
import path from 'path';

// Crée le dossier logs s'il n'existe pas
const logsDir = './logs';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
      return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaStr}`;
    })
  ),
  transports: [
    // Logs en développement : console colorée
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] ${level}: ${message}`;
        })
      ),
    }),
    
    // Erreurs dans un fichier séparé
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Tous les logs dans un fichier combiné
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

export default logger;
