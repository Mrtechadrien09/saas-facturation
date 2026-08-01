import { Schema, model, Document } from 'mongoose';
import Invoice from '../models/Invoice.js';
// 1. Définition de la structure d'un article dans la facture
interface IInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number; // Stocké en centimes (ex: 1000 pour 10.00€) pour éviter les bugs de décimales
  vatRate: number;   // Taux de TVA (ex: 20 pour 20%)
}

// 2. Définition de la structure globale de la facture pour TypeScript
export interface IInvoice extends Document {
  companyId: string;
  customerId: string;
  invoiceNumber: string; // ex: FACT-2026-0001
  issueDate: Date;
  dueDate: Date;
  items: IInvoiceItem[];
  subTotal: number; // Total HT en centimes
  vatTotal: number; // Total TVA en centimes
  total: number;    // Total TTC en centimes
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
}

// 3. Création du Schéma Mongoose pour MongoDB
const InvoiceSchema = new Schema<IInvoice>({
  companyId: { type: String, required: true, index: true },
  customerId: { type: String, required: true },
  invoiceNumber: { type: String, required: true },
  issueDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: true },
  items: [{
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    vatRate: { type: Number, required: true },
  }],
  subTotal: { type: Number, required: true },
  vatTotal: { type: Number, required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ['DRAFT', 'SENT', 'PAID', 'OVERDUE'], default: 'DRAFT', index: true },
}, { timestamps: true }); // Génère automatiquement les dates "createdAt" et "updatedAt"

export default model<IInvoice>('Invoice', InvoiceSchema);