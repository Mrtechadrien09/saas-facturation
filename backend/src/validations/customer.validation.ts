import { z } from 'zod';

export const customerBodySchema = z.object({
  name: z.string({
    required_error: "Le nom du client est obligatoire.",
  }).min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.string({
    required_error: "L'adresse email est obligatoire.",
  }).email("L'adresse email n'est pas valide."),
  phone: z.string().optional().refine(
    (value) => !value || /^\+?[0-9][0-9\s.-]{5,20}$/.test(value),
    {
      message: "Le numéro de téléphone doit être valide.",
    }
  ),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().min(2, "Le pays est invalide.").optional(),
  }).optional(),
});

export const createCustomerSchema = z.object({
  body: customerBodySchema,
});

export const updateCustomerSchema = z.object({
  body: customerBodySchema.partial(),
});