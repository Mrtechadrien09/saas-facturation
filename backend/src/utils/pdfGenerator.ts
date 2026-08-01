import PDFDocument from 'pdfkit';
import { Response } from 'express';

const NAVY = '#2B3A67';
const GOLD = '#C9A227';
const GRAY = '#6B7280';
const LIGHT_GRAY = '#F3F4F6';

const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const buildInvoicePdfFilename = (companyName: string, invoiceNumber: string): string => {
  const companySlug = slugify(companyName || '');
  const invoiceSlug = slugify(invoiceNumber || '');
  const parts = [companySlug, 'facture', invoiceSlug].filter(Boolean);

  return parts.length > 0 ? `${parts.join('-')}.pdf` : 'facture.pdf';
};

export const generateInvoicePDF = (invoice: any, res: Response) => {
  const doc = new PDFDocument({ size: 'A4', margin: 0 });
  doc.pipe(res);
  buildInvoiceContent(doc, invoice);
  doc.end();
};

export const generateInvoicePDFBuffer = (invoice: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 0 });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    buildInvoiceContent(doc, invoice);
    doc.end();
  });
};

function buildInvoiceContent(doc: PDFKit.PDFDocument, invoice: any) {
    const pageWidth = doc.page.width;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  // --- BANDEAU HAUT ---
  doc.rect(0, 0, pageWidth, 110).fill(NAVY);
  doc
    .fillColor('#FFFFFF')
    .fontSize(26)
    .font('Helvetica-Bold')
    .text('FACTURE', margin, 38);

  doc
    .fontSize(10)
    .font('Helvetica')
    .fillColor('#D1D5DB')
    .text(invoice.invoiceNumber || `#${invoice._id.toString().substring(0, 8).toUpperCase()}`, margin, 72);

  // Badge statut, en haut à droite du bandeau
  const statusLabels: Record<string, string> = {
    DRAFT: 'BROUILLON', SENT: 'ENVOYÉE', PAID: 'PAYÉE', OVERDUE: 'EN RETARD',
  };
  const statusText = statusLabels[invoice.status] || invoice.status;
  doc.font('Helvetica-Bold').fontSize(11).fillColor(GOLD);
  doc.text(statusText, pageWidth - margin - 150, 45, { width: 150, align: 'right' });

  doc.fillColor('#D1D5DB').font('Helvetica').fontSize(10);
  doc.text(
    `Échéance : ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}`,
    pageWidth - margin - 150, 65, { width: 150, align: 'right' }
  );

  // --- BLOC ÉMETTEUR / CLIENT ---
  let y = 140;
  const colWidth = contentWidth / 2 - 10;

  doc.roundedRect(margin, y, colWidth, 90, 4).fillAndStroke(LIGHT_GRAY, LIGHT_GRAY);
  doc.roundedRect(margin + colWidth + 20, y, colWidth, 90, 4).fillAndStroke(LIGHT_GRAY, LIGHT_GRAY);

  doc.fillColor(GRAY).font('Helvetica-Bold').fontSize(9).text('ÉMETTEUR', margin + 15, y + 14);
  doc.fillColor('#111827').font('Helvetica').fontSize(10).text(
    invoice.companyName || `Entreprise #${invoice.companyId.toString().substring(0, 8)}`,
    margin + 15, y + 32, { width: colWidth - 30 }
  );

  doc.fillColor(GRAY).font('Helvetica-Bold').fontSize(9).text('CLIENT', margin + colWidth + 35, y + 14);
  doc.fillColor('#111827').font('Helvetica').fontSize(10).text(
    invoice.customerName || `Client #${invoice.customerId.toString().substring(0, 8)}`,
    margin + colWidth + 35, y + 32, { width: colWidth - 30 }
  );

  // --- TABLEAU ARTICLES ---
  y += 120;
  const cols = {
    description: { x: margin, width: 210 },
    qty: { x: margin + 210, width: 50 },
    price: { x: margin + 260, width: 75 },
    vat: { x: margin + 335, width: 45 },
    total: { x: margin + 380, width: contentWidth - 380 },
  };

  // En-tête tableau
  doc.rect(margin, y, contentWidth, 26).fill(NAVY);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(9);
  doc.text('DESCRIPTION', cols.description.x + 10, y + 9);
  doc.text('QTÉ', cols.qty.x, y + 9, { width: cols.qty.width, align: 'right' });
  doc.text('PRIX U.', cols.price.x, y + 9, { width: cols.price.width, align: 'right' });
  doc.text('TVA', cols.vat.x, y + 9, { width: cols.vat.width, align: 'right' });
  doc.text('TOTAL TTC', cols.total.x, y + 9, { width: cols.total.width - 10, align: 'right' });

  y += 26;

  // Lignes, fond alterné
  invoice.items.forEach((item: any, i: number) => {
    const rowHeight = 28;
    if (i % 2 === 1) {
      doc.rect(margin, y, contentWidth, rowHeight).fill(LIGHT_GRAY);
    }

    const price = item.unitPrice / 100;
    const itemTotal = (item.unitPrice * item.quantity * (1 + item.vatRate / 100)) / 100;

    doc.fillColor('#111827').font('Helvetica').fontSize(9.5);
    doc.text(item.description, cols.description.x + 10, y + 9, { width: cols.description.width - 15 });
    doc.text(item.quantity.toString(), cols.qty.x, y + 9, { width: cols.qty.width, align: 'right' });
    doc.text(`${price.toFixed(2)} €`, cols.price.x, y + 9, { width: cols.price.width, align: 'right' });
    doc.text(`${item.vatRate}%`, cols.vat.x, y + 9, { width: cols.vat.width, align: 'right' });
    doc.font('Helvetica-Bold').text(`${itemTotal.toFixed(2)} €`, cols.total.x, y + 9, { width: cols.total.width - 10, align: 'right' });

    y += rowHeight;
  });

  // Ligne de fermeture du tableau
  doc.moveTo(margin, y).lineTo(margin + contentWidth, y).strokeColor('#E5E7EB').stroke();

  // --- TOTAUX ---
  y += 20;
  const totalsBoxWidth = 220;
  const totalsX = margin + contentWidth - totalsBoxWidth;

  doc.fontSize(10).font('Helvetica').fillColor(GRAY);
  doc.text('Sous-total HT', totalsX, y, { width: totalsBoxWidth - 90 });
  doc.fillColor('#111827').text(`${(invoice.subTotal / 100).toFixed(2)} €`, totalsX + totalsBoxWidth - 90, y, { width: 90, align: 'right' });

  y += 18;
  doc.fillColor(GRAY).text('TVA', totalsX, y, { width: totalsBoxWidth - 90 });
  doc.fillColor('#111827').text(`${(invoice.vatTotal / 100).toFixed(2)} €`, totalsX + totalsBoxWidth - 90, y, { width: 90, align: 'right' });

  y += 24;
  doc.rect(totalsX, y, totalsBoxWidth, 34).fill(NAVY);
  doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(12);
  doc.text('TOTAL TTC', totalsX + 15, y + 11);
  doc.fontSize(13).text(`${(invoice.total / 100).toFixed(2)} €`, totalsX, y + 10, { width: totalsBoxWidth - 15, align: 'right' });

  // --- PIED DE PAGE ---
  const footerY = doc.page.height - 70;
  doc.moveTo(margin, footerY).lineTo(margin + contentWidth, footerY).strokeColor('#E5E7EB').stroke();
  doc.fontSize(8).font('Helvetica').fillColor(GRAY).text(
    'Merci pour votre confiance.',
    margin, footerY + 12, { width: contentWidth, align: 'center' }
  );

}