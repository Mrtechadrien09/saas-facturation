import { Router } from 'express';
import  passport  from 'passport';
import { generateToken } from '../controllers/auth.controller.js';
import { register, login, forgotPassword, resetPassword, verifyEmail, resendVerification } from '../controllers/auth.controller.js';
import { loginLimiter, registerLimiter, emailActionLimiter } from '../middleware/rateLimiter.js'
const router = Router();

// Ces routes seront préfixées par /api/auth grâce à ton index.ts
router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/forgot-password', emailActionLimiter, forgotPassword);
router.post('/resend-verification', emailActionLimiter, resendVerification);
router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);

// ==========================================
// 🌐 ROUTES GOOGLE
// ==========================================
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: process.env.FRONTEND_URL || 'https://saas-facturation-ivory.vercel.app', session: false }),
  (req: any, res) => {
    const user = req.user;

    const token = generateToken(user._id.toString());

    res.redirect(`${process.env.FRONTEND_URL || 'https://saas-facturation-ivory.vercel.app'}?token=${token}`);
  }
);

// ==========================================
// 🐙 ROUTES GITHUB
// ==========================================
router.get('/github', 
  passport.authenticate('github', { scope: ['user:email'], session: false })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: process.env.FRONTEND_URL || 'https://saas-facturation-ivory.vercel.app', session: false }),
  (req: any, res) => {
    const user = req.user;

    const token = generateToken(user._id.toString());

    res.redirect(`${process.env.FRONTEND_URL || 'https://saas-facturation-ivory.vercel.app'}?token=${token}`);
  }
);

export default router;