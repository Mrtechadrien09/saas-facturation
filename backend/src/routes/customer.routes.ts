import { Router } from 'express';
import { createCustomer, getMyCustomers, deleteCustomer, updateCustomer, getCustomerById } from '../controllers/customer.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.middleware.js';
import { createCustomerSchema, updateCustomerSchema } from '../validations/customer.validation.js';

const router = Router();

router.post('/', requireAuth, validate(createCustomerSchema), createCustomer);
router.get('/', requireAuth, getMyCustomers);
router.get('/:id', requireAuth, getCustomerById);
router.delete('/:id', requireAuth, deleteCustomer);
router.put('/:id', requireAuth, validate(updateCustomerSchema), updateCustomer);
export default router;