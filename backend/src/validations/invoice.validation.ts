import { z } from 'zod';

// 1. Schéma pour la CRÉATION d'une facture
export const createInvoiceSchema = z.object({
  body: z.object({
    customerId: z.string({
      required_error: "L'identifiant du client est obligatoire.",
    }).min(1, "L'identifiant du client ne peut pas être vide."),
    
    dueDate: z.string({
      required_error: "La date d'échéance est obligatoire.",
    }).regex(/^\d{4}-\d{2}-\d{2}$/, "La date doit être au format AAAA-MM-JJ."),

    status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE']).optional(),

    items: z.array(
      z.object({
        description: z.string({
          required_error: "La description de l'article est obligatoire.",
        }).min(3, "La description doit faire au moins 3 caractères."),
        
        quantity: z.number({
          required_error: "La quantité est obligatoire.",
        }).positive("La quantité doit être supérieure à 0."),
        
        unitPrice: z.number({
          required_error: "Le prix unitaire est obligatoire.",
        }).nonnegative("Le prix unitaire ne peut pas être négatif."),
        
        vatRate: z.number({
          required_error: "Le taux de TVA est obligatoire.",
        }).nonnegative("Le taux de TVA ne peut pas être négatif."),
      }),
      { required_error: "La facture doit contenir au moins un article." }
    ).min(1, "Vous devez ajouter au moins un article à la facture."),
  }),
});

// 2. Schéma pour la MISE À JOUR du statut d'une facture
export const updateInvoiceStatusSchema = z.object({
  params: z.object({
    id: z.string().min(1, "L'identifiant de la facture est requis."),
  }),
  body: z.object({
    status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE'], {
      required_error: "Le nouveau statut est obligatoire.",
    }),
  }),
});