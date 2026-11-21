import { buildInvoicePdfFilename, generateInvoicePDFBuffer } from '../pdfGenerator.js';

describe('buildInvoicePdfFilename', () => {
  it('construit un nom de fichier propre à partir du nom de l entreprise et du numéro de facture', () => {
    expect(buildInvoicePdfFilename('Acme Studio', 'FA-2024-001')).toBe('acme-studio-facture-fa-2024-001.pdf');
  });

  it('utilise un fallback si le nom de l entreprise est absent', () => {
    expect(buildInvoicePdfFilename('', 'FA-2024-002')).toBe('facture-fa-2024-002.pdf');
  });

  it('génère un PDF avec les champs du modèle de facture', async () => {
    const pdf = await generateInvoicePDFBuffer({
      invoiceNumber: 'FA-2026-001',
      issueDate: new Date('2026-11-21T00:00:00.000Z'),
      dueDate: new Date('2026-12-21T00:00:00.000Z'),
      companyName: 'Simplifact',
      companyAddress: { street: '10 rue de Paris', zipCode: '75001', city: 'Paris', country: 'France' },
      companySiret: '12345678901234',
      customerName: 'Client Exemple',
      customerAddress: { street: '5 avenue Victor Hugo', city: 'Lyon', zipCode: '69001' },
      currency: 'EUR',
      items: [{ description: 'Prestation de conseil', quantity: 2, unitPrice: 12500, vatRate: 20 }],
      subTotal: 25000,
      vatTotal: 5000,
      total: 30000,
    });

    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    expect(pdf.length).toBeGreaterThan(1000);
  });
});
