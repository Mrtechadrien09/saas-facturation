import rateLimit from 'express-rate-limit';

// Pour login : limite stricte, cible le bruteforce de mot de passe
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { success: false, message: "Trop de tentatives de connexion. Réessaie dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Pour register : évite la création massive de faux comptes
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 5,
  message: { message: "Trop de comptes créés depuis cette adresse. Réessaie plus tard." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Pour forgot-password / resend-verification : protège ton quota email
export const emailActionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  message: { message: "Trop de demandes. Réessaie dans 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});