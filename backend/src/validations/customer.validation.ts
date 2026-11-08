import { z } from 'zod';

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value === 'string' && value.trim() === '') {
    return undefined;
  }
  return value;
};

const optionalTrimmedString = (message?: string) =>
  z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, message ?? 'Ce champ ne peut pas être vide.').optional()
  );

export const customerBodySchema = z.object({
  name: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim() : value),
    z.string({ required_error: 'Le nom du client est obligatoire.' }).min(2, 'Le nom doit contenir au moins 2 caractères.')
  ),
  email: z.preprocess(
    (value) => (typeof value === 'string' ? value.trim().toLowerCase() : value),
    z.string({ required_error: "L'adresse email est obligatoire." }).email("L'adresse email n'est pas valide.")
  ),
  phone: z.preprocess(
    emptyStringToUndefined,
    z.string().refine((value) => !value || /^\+?[0-9][0-9\s().-]{5,25}$/.test(value), {
      message: 'Le numéro de téléphone doit être valide.',
    }).optional()
  ),
  address: z.preprocess((value) => {
    if (!value || typeof value !== 'object') return value;

    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, fieldValue]) => [
        key,
        typeof fieldValue === 'string' ? fieldValue.trim() : fieldValue,
      ])
    );
  }, z.object({
    street: optionalTrimmedString(),
    city: optionalTrimmedString(),
    zipCode: optionalTrimmedString(),
    country: optionalTrimmedString('Le pays est invalide.'),
  }).passthrough().optional()),
});

export const createCustomerSchema = z.object({
  body: customerBodySchema,
});

export const updateCustomerSchema = z.object({
  body: customerBodySchema.partial(),
});