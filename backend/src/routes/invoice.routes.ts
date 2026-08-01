import { Router } from 'express';
import { createInvoice, getMyInvoices, getInvoiceById, updateInvoiceStatus, getInvoiceStats, deleteInvoice, downloadInvoicePDF, sendInvoiceByEmail} from '../controllers/invoice.controller.js';
import {validate} from '../middleware/validator.js';
import { createInvoiceSchema, updateInvoiceStatusSchema } from '../validations/invoice.validation.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();

//Désormaqis faut etre connecté pour faire un POST ici!
router.post('/', requireAuth, validate(createInvoiceSchema), createInvoice);
router.post('/:id/send', requireAuth, sendInvoiceByEmail);
router.get('/', requireAuth, getMyInvoices);
router.get('/stats', requireAuth, getInvoiceStats);
router.get('/:id/pdf', requireAuth, downloadInvoicePDF);
router.get('/:id', requireAuth, getInvoiceById);
router.patch('/:id/status', requireAuth, validate(updateInvoiceStatusSchema), updateInvoiceStatus);
router.delete('/:id',requireAuth, deleteInvoice);

export default router;