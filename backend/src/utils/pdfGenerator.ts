import PDFDocument from 'pdfkit';
import { Response } from 'express';
import { fileURLToPath } from 'node:url';

const INK = '#101114';
const TEXT = '#172033';
const GRAY = '#596273';
const RED = '#F02A2A';
const INVOICE_TEMPLATE_PATH = fileURLToPath(new URL('../../assets/invoice-template.png', import.meta.url));

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

const getImageBufferFromDataUrl = (dataUrl?: string): Buffer | null => {
  if (!dataUrl || !dataUrl.startsWith('data:image/')) return null;

  try {
    const base64 = dataUrl.split(',')[1] || '';
    return Buffer.from(base64, 'base64');
  } catch {
    return null;
  }
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
  const pageHeight = doc.page.height;
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  const scaleX = pageWidth / 597;
  const scaleY = pageHeight / 842;
  const currency = invoice.currency || 'EUR';
  const formatMoney = (cents: number) => new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
  }).format((cents || 0) / 100);
  const formatDate = (value?: string | Date) => value
    ? new Date(value).toLocaleDateString('fr-FR')
    : '—';
  const companyAddress = [
    invoice.companyAddress?.street,
    [invoice.companyAddress?.zipCode, invoice.companyAddress?.city].filter(Boolean).join(' '),
    invoice.companyAddress?.country,
  ].filter(Boolean);
  const customerAddress = [
    invoice.customerAddress?.street,
    [invoice.customerAddress?.zipCode, invoice.customerAddress?.city].filter(Boolean).join(' '),
    invoice.customerAddress?.country,
  ].filter(Boolean);
  const footerY = 779 * scaleY;
  const columns = {
    description: { x: 50 * scaleX, width: 205 * scaleX },
    quantity: { x: 260 * scaleX, width: 45 * scaleX },
    price: { x: 330 * scaleX, width: 55 * scaleX },
    vat: { x: 405 * scaleX, width: 35 * scaleX },
    total: { x: 470 * scaleX, width: 75 * scaleX },
  };

  const drawFooter = () => {
    doc.moveTo(margin, footerY).lineTo(pageWidth - margin, footerY).strokeColor('#111111').lineWidth(0.7).stroke();
    const footerText = [
      invoice.companyName,
      invoice.companySiret ? `SIRET / NIU : ${invoice.companySiret}` : '',
      'Merci de votre confiance',
    ].filter(Boolean).join(' - ');
    doc.font('Helvetica').fontSize(8).fillColor('#7A8494')
      .text(footerText, margin, footerY + 10 * scaleY, { width: contentWidth, align: 'center' });
  };

  const drawTableHeader = (y: number) => {
    doc.roundedRect(margin, y, contentWidth, 51 * scaleY, 8).fill(INK);
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#FFFFFF');
    doc.text('DESCRIPTION', columns.description.x, y + 22 * scaleY, { width: columns.description.width });
    doc.text('QTÉ', columns.quantity.x, y + 22 * scaleY, { width: columns.quantity.width, align: 'right' });
    doc.text('PRIX U', columns.price.x, y + 22 * scaleY, { width: columns.price.width, align: 'right' });
    doc.text('TVA', columns.vat.x, y + 22 * scaleY, { width: columns.vat.width, align: 'right' });
    doc.text('TOTAL TTC', columns.total.x, y + 22 * scaleY, { width: columns.total.width, align: 'right' });
  };

  const drawTemplatePage = () => {
    doc.image(INVOICE_TEMPLATE_PATH, 0, 0, { width: pageWidth, height: pageHeight });

    // Keep the template's printed layout, replacing only the Figma placeholders.
    doc.rect(106 * scaleX, 65 * scaleY, 257 * scaleX, 28 * scaleY).fill('#FFFFFF');
    doc.rect(446 * scaleX, 66 * scaleY, 110 * scaleX, 18 * scaleY).fill('#FFFFFF');
    doc.rect(423 * scaleX, 85 * scaleY, 133 * scaleX, 18 * scaleY).fill('#FFFFFF');
    doc.rect(39 * scaleX, 166 * scaleY, 324 * scaleX, 67 * scaleY).fill('#FFFFFF');
    doc.roundedRect(377 * scaleX, 166 * scaleY, 172 * scaleX, 69 * scaleY, 5).fill('#F7F9FB');
    doc.rect(39 * scaleX, 333 * scaleY, 517 * scaleX, pageHeight - 333 * scaleY).fill('#FFFFFF');

    const logoBuffer = getImageBufferFromDataUrl(invoice.companyLogoUrl);
    if (logoBuffer) {
      try {
        doc.image(logoBuffer, 40 * scaleX, 36 * scaleY, {
          fit: [66 * scaleX, 66 * scaleY],
          align: 'center',
          valign: 'center',
        });
      } catch {
        // Keep the gray logo placeholder from the template for unsupported image formats.
      }
    }

    doc.font('Helvetica-Bold').fontSize(15).fillColor(TEXT)
      .text(invoice.companyName || 'Votre entreprise', 116 * scaleX, 68 * scaleY, {
        width: 245 * scaleX,
        ellipsis: true,
      });

    doc.font('Helvetica-Bold').fontSize(9).fillColor(GRAY)
      .text(`N : ${invoice.invoiceNumber || '—'}`, 445 * scaleX, 70 * scaleY, { width: 110 * scaleX, align: 'right' });
    doc.font('Helvetica-Bold').fontSize(9).fillColor(GRAY)
      .text(`Date : ${formatDate(invoice.issueDate)}`, 423 * scaleX, 89 * scaleY, { width: 132 * scaleX, align: 'right' });

    doc.font('Helvetica').fontSize(9.5).fillColor(TEXT)
      .text(companyAddress.join(', '), 40 * scaleX, 169 * scaleY, { width: 320 * scaleX, height: 14 * scaleY, ellipsis: true });
    doc.text(invoice.companyPhone ? `Tél. : ${invoice.companyPhone}` : '', 40 * scaleX, 186 * scaleY, { width: 320 * scaleX });
    doc.text(invoice.companyEmail ? `Email : ${invoice.companyEmail}` : '', 40 * scaleX, 202 * scaleY, { width: 320 * scaleX });
    doc.text(invoice.companySiret ? `Siret : ${invoice.companySiret}` : '', 40 * scaleX, 218 * scaleY, { width: 320 * scaleX });

    const clientLines = [
      invoice.customerName || 'Client',
      ...customerAddress,
      invoice.customerPhone || '',
    ].filter(Boolean);
    doc.font('Helvetica').fontSize(9.5).fillColor(TEXT)
      .text(clientLines.join('\n'), 379 * scaleX, 169 * scaleY, {
        width: 165 * scaleX,
        height: 62 * scaleY,
        lineGap: 2,
        ellipsis: true,
      });
  };

  const drawContinuationHeader = () => {
    doc.font('Helvetica-Bold').fontSize(15).fillColor(TEXT)
      .text(`FACTURE - suite ${invoice.invoiceNumber || ''}`, margin, 38, { width: contentWidth });
    doc.moveTo(margin, 65).lineTo(pageWidth - margin, 65).strokeColor('#D9DEE6').lineWidth(0.8).stroke();
    drawTableHeader(82);
    return 82 + 51 * scaleY;
  };

  drawTemplatePage();
  let y = 333 * scaleY;
  const items = invoice.items || [];
  const totalsAreaHeight = 111 * scaleY;

  items.forEach((item: any) => {
    const descriptionHeight = doc.font('Helvetica').fontSize(9.5)
      .heightOfString(item.description || '', { width: columns.description.width });
    const rowHeight = Math.max(48 * scaleY, descriptionHeight + 20 * scaleY);

    if (y + rowHeight + totalsAreaHeight > footerY - 12 * scaleY) {
      drawFooter();
      doc.addPage({ size: 'A4', margin: 0 });
      y = drawContinuationHeader();
    }

    doc.font('Helvetica').fontSize(9.5).fillColor(TEXT);
    doc.text(item.description || '', columns.description.x, y + 15 * scaleY, { width: columns.description.width });
    doc.text(String(item.quantity ?? ''), columns.quantity.x, y + 15 * scaleY, { width: columns.quantity.width, align: 'right' });
    doc.text(formatMoney(item.unitPrice || 0), columns.price.x, y + 15 * scaleY, { width: columns.price.width, align: 'right' });
    doc.text(`${item.vatRate ?? 0}%`, columns.vat.x, y + 15 * scaleY, { width: columns.vat.width, align: 'right' });
    const lineTotal = Math.round((item.unitPrice || 0) * (item.quantity || 0) * (1 + (item.vatRate || 0) / 100));
    doc.font('Helvetica-Bold').text(formatMoney(lineTotal), columns.total.x, y + 15 * scaleY, { width: columns.total.width, align: 'right' });
    y += rowHeight;
    doc.moveTo(margin, y).lineTo(pageWidth - margin, y).strokeColor('#111111').lineWidth(0.65).stroke();
  });

  y = Math.max(y + 40 * scaleY, 423 * scaleY);
  if (y + totalsAreaHeight > footerY - 12 * scaleY) {
    drawFooter();
    doc.addPage({ size: 'A4', margin: 0 });
    y = drawContinuationHeader() + 16 * scaleY;
  }

  const totalsX = 333 * scaleX;
  const totalsWidth = 221 * scaleX;
  const valueX = 440 * scaleX;
  const valueWidth = 93 * scaleX;
  doc.font('Helvetica-Bold').fontSize(10).fillColor(INK)
    .text('Sous-total HT', totalsX, y, { width: 108 * scaleX });
  doc.font('Helvetica').fontSize(10).fillColor(TEXT)
    .text(formatMoney(invoice.subTotal), valueX, y, { width: valueWidth, align: 'right' });
  y += 36 * scaleY;
  doc.font('Helvetica-Bold').fontSize(10).fillColor(INK)
    .text('Total TVA', totalsX, y, { width: 108 * scaleX });
  doc.font('Helvetica').fontSize(10).fillColor(TEXT)
    .text(formatMoney(invoice.vatTotal), valueX, y, { width: valueWidth, align: 'right' });
  y += 18 * scaleY;

  doc.roundedRect(totalsX, y, totalsWidth, 41 * scaleY, 8).fill('#000000');
  doc.font('Helvetica-Bold').fontSize(12).fillColor(RED)
    .text('TOTAL TTC', totalsX + 4 * scaleX, y + 12 * scaleY, { width: 105 * scaleX });
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#FFFFFF')
    .text(formatMoney(invoice.total), valueX, y + 12 * scaleY, { width: valueWidth, align: 'right' });

  drawFooter();
}