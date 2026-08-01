export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number; // en centimes
  vatRate: number;   // en %, ex: 20
}

export type InvoiceStatus = "DRAFT" | "SENT" | "PAID" | "OVERDUE";

export interface Invoice {
  _id: string;
  companyId: string;
  customerId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subTotal: number; // en centimes
  vatTotal: number; // en centimes
  total: number;    // en centimes
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
}