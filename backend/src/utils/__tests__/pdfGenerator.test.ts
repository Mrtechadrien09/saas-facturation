import { buildInvoicePdfFilename } from '../pdfGenerator';

describe('buildInvoicePdfFilename', () => {
  it('construit un nom de fichier propre à partir du nom de l entreprise et du numéro de facture', () => {
    expect(buildInvoicePdfFilename('Acme Studio', 'FA-2024-001')).toBe('acme-studio-facture-fa-2024-001.pdf');
  });

  it('utilise un fallback si le nom de l entreprise est absent', () => {
    expect(buildInvoicePdfFilename('', 'FA-2024-002')).toBe('facture-fa-2024-002.pdf');
  });
});
