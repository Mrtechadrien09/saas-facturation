import { Router } from 'express';
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
export default router;