import { z } from "zod";

// Auth Validation
export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe d'au moins 6 caractères"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe d'au moins 6 caractères"),
  companyName: z.string().optional(),
});

// Customer Validation
export const customerSchema = z.object({
  name: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

// Invoice Item Validation
export const invoiceItemSchema = z.object({
  description: z.string().min(3, "Description d'au moins 3 caractères"),
  quantity: z.number().positive("Quantité > 0"),
  unitPrice: z.number().nonnegative("Prix >= 0"),
  vatRate: z.number().nonnegative("TVA >= 0"),
});

// Invoice Validation
export const createInvoiceSchema = z.object({
  customerId: z.string().min(1, "Client requis"),
  dueDate: z.string().refine(
    (date) => !isNaN(Date.parse(date)),
    "Date invalide"
  ),
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE"]).optional(),
  items: z.array(invoiceItemSchema).min(1, "Au moins un article requis"),
});

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE"]),
});

// Types inférés
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CustomerInput = z.infer<typeof customerSchema>;
export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceStatusInput = z.infer<typeof updateInvoiceStatusSchema>;
