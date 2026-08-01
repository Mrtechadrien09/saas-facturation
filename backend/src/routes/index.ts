import { Router } from 'express';
import authRoutes from './auth.routes.js';
import invoiceRoutes from './invoice.routes.js';
import customerRoutes from './customer.routes.js';
import settingsRoutes from './settings.routes.js';

const router = Router();

// On préfixe toutes les routes de factures par /invoices
router.use('/auth', authRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/customers',customerRoutes);
router.use('/settings', settingsRoutes);



export default router;