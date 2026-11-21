import PDFDocument from 'pdfkit';
import { Response } from 'express';

const INK = '#101114';
const TEXT = '#172033';
const GRAY = '#596273';
const LIGHT_GRAY = '#F5F7FA';
const RED = '#F02A2A';

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
  const footerY = pageHeight - 62;
  const columns = {
    description: { x: margin + 11, width: 225 },
    quantity: { x: margin + 236, width: 48 },
    price: { x: margin + 284, width: 68 },
    vat: { x: margin + 352, width: 42 },
    total: { x: margin + 394, width: contentWidth - 405 },
  };

  const drawFooter = () => {
    doc.moveTo(margin, footerY).lineTo(pageWidth - margin, footerY).strokeColor('#111111').lineWidth(0.7).stroke();
    const footerText = [
      invoice.companyName,
      invoice.companySiret ? `SIRET / NIU : ${invoice.companySiret}` : '',
      'Merci de votre confiance',
    ].filter(Boolean).join(' - ');
    doc.font('Helvetica').fontSize(8).fillColor('#7A8494')
      .text(footerText, margin, footerY + 10, { width: contentWidth, align: 'center' });
  };

  const drawTableHeader = (y: number) => {
    doc.roundedRect(margin, y, contentWidth, 40, 8).fill(INK);
    doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#FFFFFF');
    doc.text('DESCRIPTION', columns.description.x, y + 15, { width: columns.description.width });
    doc.text('QTÉ', columns.quantity.x, y + 15, { width: columns.quantity.width, align: 'right' });
    doc.text('PRIX U.', columns.price.x, y + 15, { width: columns.price.width, align: 'right' });
    doc.text('TVA', columns.vat.x, y + 15, { width: columns.vat.width, align: 'right' });
    doc.text('TOTAL TTC', columns.total.x, y + 15, { width: columns.total.width, align: 'right' });
  };

  const drawPageHeader = () => {
    const logoBuffer = getImageBufferFromDataUrl(invoice.companyLogoUrl);
    if (logoBuffer) {
      try {
        doc.image(logoBuffer, margin, 34, { fit: [66, 66] });
      } catch {
        doc.rect(margin, 36, 66, 66).fill('#D9D9D9');
      }
    } else {
      doc.rect(margin, 36, 66, 66).fill('#D9D9D9');
    }

    doc.font('Helvetica-Bold').fontSize(15).fillColor(TEXT)
      .text(invoice.companyName || 'Votre entreprise', margin + 66, 62, {
        width: 245,
        ellipsis: true,
      });

    doc.font('Helvetica-Bold').fontSize(28).fillColor(TEXT)
      .text('FACTURE', pageWidth - margin - 185, 34, { width: 185, align: 'right' });
    doc.font('Helvetica-Bold').fontSize(10).fillColor(GRAY)
      .text(`N : ${invoice.invoiceNumber || '—'}`, pageWidth - margin - 185, 70, { width: 185, align: 'right' });
    doc.font('Helvetica-Bold').fontSize(10).fillColor(GRAY)
      .text(`Date : ${formatDate(invoice.issueDate)}`, pageWidth - margin - 185, 88, { width: 185, align: 'right' });

    doc.moveTo(margin, 116).lineTo(pageWidth - margin, 116).strokeColor('#D9DEE6').lineWidth(0.8).stroke();
  };

  const drawPartyDetails = () => {
    const sectionY = 146;
    const rightX = pageWidth - margin - 180;
    const rightWidth = 180;
    const companyLines = [
      ...companyAddress,
      invoice.companyPhone ? `Tél. : ${invoice.companyPhone}` : '',
      invoice.companyEmail ? `Email : ${invoice.companyEmail}` : '',
      invoice.companySiret ? `Siret : ${invoice.companySiret}` : '',
    ].filter(Boolean);
    const clientLines = [
      ...customerAddress,
      invoice.customerPhone ? `Tél. : ${invoice.customerPhone}` : '',
      invoice.customerEmail || '',
    ].filter(Boolean);

    doc.font('Helvetica-Bold').fontSize(10).fillColor(INK).text('Emetteur :', margin, sectionY);
    doc.font('Helvetica').fontSize(9.5).fillColor(TEXT)
      .text(companyLines.join('\n'), margin, sectionY + 17, { width: 245, lineGap: 2 });

    doc.roundedRect(rightX, sectionY - 5, rightWidth, 100, 8).fill(LIGHT_GRAY);
    doc.font('Helvetica-Bold').fontSize(10).fillColor(INK).text('Facturé à :', rightX + 12, sectionY + 7);
    doc.font('Helvetica').fontSize(9.5).fillColor(TEXT)
      .text([invoice.customerName || 'Client', ...clientLines].join('\n'), rightX + 12, sectionY + 24, {
        width: rightWidth - 24,
        lineGap: 2,
      });
  };

  drawPageHeader();
  drawPartyDetails();

  let y = 282;
  drawTableHeader(y);
  y += 40;

  (invoice.items || []).forEach((item: any) => {
    const descriptionHeight = doc.font('Helvetica').fontSize(9.5)
      .heightOfString(item.description || '', { width: columns.description.width });
    const rowHeight = Math.max(38, descriptionHeight + 20);

    if (y + rowHeight > footerY - 25) {
      drawFooter();
      doc.addPage({ size: 'A4', margin: 0 });
      y = 48;
      drawTableHeader(y);
      y += 40;
    }

    doc.font('Helvetica').fontSize(9.5).fillColor(TEXT);
    doc.text(item.description || '', columns.description.x, y + 12, { width: columns.description.width });
    doc.text(String(item.quantity ?? ''), columns.quantity.x, y + 12, { width: columns.quantity.width, align: 'right' });
    doc.text(formatMoney(item.unitPrice || 0), columns.price.x, y + 12, { width: columns.price.width, align: 'right' });
    doc.text(`${item.vatRate ?? 0}%`, columns.vat.x, y + 12, { width: columns.vat.width, align: 'right' });
    const lineTotal = Math.round((item.unitPrice || 0) * (item.quantity || 0) * (1 + (item.vatRate || 0) / 100));
    doc.font('Helvetica-Bold').text(formatMoney(lineTotal), columns.total.x, y + 12, { width: columns.total.width, align: 'right' });
    y += rowHeight;
    doc.moveTo(margin, y).lineTo(pageWidth - margin, y).strokeColor('#111111').lineWidth(0.65).stroke();
  });

  y += 34;
  const totalsBoxWidth = 220;
  const totalsX = pageWidth - margin - totalsBoxWidth;
  const totalsHeight = 111;
  if (y + totalsHeight > footerY - 10) {
    drawFooter();
    doc.addPage({ size: 'A4', margin: 0 });
    y = 60;
  }

  doc.font('Helvetica-Bold').fontSize(10).fillColor(INK)
    .text('Sous-total HT', totalsX, y, { width: 110 });
  doc.font('Helvetica').fontSize(10).fillColor(TEXT)
    .text(formatMoney(invoice.subTotal), totalsX + 110, y, { width: 110, align: 'right' });
  y += 32;
  doc.font('Helvetica-Bold').fontSize(10).fillColor(INK)
    .text('Total TVA', totalsX, y, { width: 110 });
  doc.font('Helvetica').fontSize(10).fillColor(TEXT)
    .text(formatMoney(invoice.vatTotal), totalsX + 110, y, { width: 110, align: 'right' });
  y += 18;

  doc.roundedRect(totalsX, y, totalsBoxWidth, 40, 8).fill('#000000');
  doc.font('Helvetica-Bold').fontSize(12).fillColor(RED)
    .text('TOTAL TTC', totalsX + 12, y + 12, { width: 90 });
  doc.font('Helvetica-Bold').fontSize(12).fillColor('#FFFFFF')
    .text(formatMoney(invoice.total), totalsX + 102, y + 12, { width: 106, align: 'right' });

  drawFooter();
}