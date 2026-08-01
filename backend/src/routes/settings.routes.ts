import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/Settings.controller.js';
import { requireAuth } from '../middleware/auth.js'; // Ton middleware d'authentification

const router = Router();

// Les deux routes sont protégées : impossible d'y toucher sans token valide
router.get('/', requireAuth, getSettings);
router.put('/', requireAuth, updateSettings);

export default router;