import dotenv from 'dotenv';
dotenv.config();
import { Request, Response, NextFunction } from 'express';
import Invoice from '../models/Invoice.js'; // Ton modèle par défaut
import { Customer } from '../models/Customer.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { Resend } from 'resend';
import Settings from '../models/Settings.js'

const resend = new Resend(process.env.RESEND_API_KEY);

// 1. Créer une facture liée à un vrai client
export const createInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const companyId = authReq.user?.userId;
    
    // Extraction des données envoyées par le test
    const { customerId, items, dueDate, status } = req.body;

    // VÉRIFICATION : Est-ce que le client existe et appartient bien à cet utilisateur ?
    const customerExists = await Customer.findOne({ _id: customerId, companyId });
    if (!customerExists) {
      return res.status(404).json({ 
        success: false, 
        message: "Le client associé à cette facture est introuvable ou ne vous appartient pas." 
      });
    }

    // Calculs automatiques des montants basés sur TON schéma
    let subTotal = 0;
    let vatTotal = 0;

    const processedItems = items.map((item: any) => {
      // item.unitPrice et item.quantity doivent être envoyés dans la requête
      const itemSubTotal = item.quantity * item.unitPrice; 
      const itemVat = itemSubTotal * (item.vatRate / 100);

      subTotal += itemSubTotal;
      vatTotal += itemVat;

      return {
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        vatRate: item.vatRate
      };
    });

    const total = subTotal + vatTotal;

    // Génération d'un numéro de facture (ex: FACT-2026-XXXXXX)
    const invoiceNumber = `FACT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Enregistrement en base de données
    const invoice = await Invoice.create({
      companyId,
      customerId,
      invoiceNumber,
      dueDate,
      items: processedItems,
      subTotal,
      vatTotal,
      total,
      status: status || 'DRAFT', // Valeur par défaut si non spécifié
    });

    return res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};

// 2. Récupérer toutes les factures de l'utilisateur connecté (avec pagination)
export const getMyInvoices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const companyId = authReq.user?.userId;
    const customerId = req.query.customerId as string | undefined;

    // Paramètres de pagination depuis la requête
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;

    const filter: { companyId: string | undefined; customerId?: string } = { companyId };
    if (customerId) {
      filter.customerId = customerId;
    }

    // Récupérer le nombre total de factures pour le frontend
    const total = await Invoice.countDocuments(filter);

    const invoices = await Invoice.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({ 
      success: true, 
      data: invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// 3. Récupérer une seule facture par son ID
export const getInvoiceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const companyId = authReq.user?.userId;
    const { id } = req.params;

    const invoice = await Invoice.findOne({ _id: id, companyId });
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Facture introuvable." });
    }

    return res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};
// 4. Mettre à jour le statut d'une facture
export const updateInvoiceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const companyId = authReq.user?.userId;
    const { id } = req.params;
    const { status } = req.body;

    // On cherche la facture ET on vérifie qu'elle appartient bien à l'entreprise connectée
    const invoice = await Invoice.findOneAndUpdate(
      { _id: id, companyId },
      { status },
      { new: true } // Permet de renvoyer la facture modifiée et non l'ancienne
    );

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Facture introuvable ou non autorisée." });
    }

    return res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    next(error);
  }
};
// 5. Récupérer les statistiques globales des factures
export const getInvoiceStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const companyId = authReq.user?.userId;

    // Agrégation MongoDB pour grouper par statut et sommer les totaux
    const stats = await Invoice.aggregate([
      { $match: { companyId } }, // On filtre uniquement pour l'utilisateur connecté
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalHT: { $sum: '$subTotal' },
          totalTTC: { $sum: '$total' }
        }
      }
    ]);

    // Formatage propre de la réponse pour le frontend
    const formattedStats = {
      PAID: { count: 0, totalHT: 0, totalTTC: 0 },
      SENT: { count: 0, totalHT: 0, totalTTC: 0 },
      DRAFT: { count: 0, totalHT: 0, totalTTC: 0 },
      OVERDUE: { count: 0, totalHT: 0, totalTTC: 0 }
    };

    stats.forEach(stat => {
      if (stat._id in formattedStats) {
        formattedStats[stat._id as keyof typeof formattedStats] = {
          count: stat.count,
          totalHT: stat.totalHT,
          totalTTC: stat.totalTTC
        };
      }
    });

    return res.status(200).json({ success: true, data: formattedStats });
  } catch (error) {
    next(error);
  }
};

// 6. Supprimer une facture
export const deleteInvoice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const companyId = authReq.user?.userId;
    const { id } = req.params;

    // On cherche la facture par son ID ET le companyId pour éviter qu'un utilisateur supprime la facture d'un autre
    const invoice = await Invoice.findOneAndDelete({ _id: id, companyId });

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Facture introuvable ou non autorisée." });
    }

    return res.status(200).json({ success: true, message: "La facture a bien été supprimée." });
  } catch (error) {
    next(error);
  }
};

import { buildInvoicePdfFilename, generateInvoicePDF, generateInvoicePDFBuffer } from '../utils/pdfGenerator.js';

// 7. Télécharger le PDF d'une facture
export const downloadInvoicePDF = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const companyId = authReq.user?.userId;
    const { id } = req.params;

    const invoice = await Invoice.findOne({ _id: id, companyId });

    if (!invoice) {
      return res.status(404).json({ success: false, message: "Facture introuvable ou non autorisée." });
    }

    // Récupère le nom du client et de l'entreprise pour les afficher dans le PDF
    const customer = await Customer.findById(invoice.customerId);
    const settings = await Settings.findOne({ companyId });

    const invoiceData = {
      ...invoice.toObject(),
      customerName: customer?.name || 'Client inconnu',
      companyName: settings?.companyInfo?.name || 'Mon entreprise',
    };

    const pdfFilename = buildInvoicePdfFilename(settings?.companyInfo?.name || '', invoice.invoiceNumber);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${pdfFilename}`);

    generateInvoicePDF(invoiceData, res);
  } catch (error) {
    next(error);
  }
};

// 8. Envoyer la facture par email au client
export const sendInvoiceByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthenticatedRequest;
    const companyId = authReq.user?.userId;
    const { id } = req.params;

    const invoice = await Invoice.findOne({ _id: id, companyId });
    if (!invoice) {
      return res.status(404).json({ success: false, message: "Facture introuvable ou non autorisée." });
    }

    const customer = await Customer.findById(invoice.customerId);
    if (!customer || !customer.email) {
      return res.status(400).json({ success: false, message: "Ce client n'a pas d'adresse email valide." });
    }

    const settings = await Settings.findOne({ companyId });
    const companyName = settings?.companyInfo?.name || 'Votre prestataire';

    // Génère le PDF en mémoire (buffer) au lieu de le streamer directement à une réponse HTTP
    const pdfBuffer = await generateInvoicePDFBuffer({
      ...invoice.toObject(),
      customerName: customer.name,
      companyName,
    });

    await resend.emails.send({
      from: 'onboarding@resend.dev', // à remplacer par ton domaine vérifié plus tard
      to: customer.email,
      subject: `Facture ${invoice.invoiceNumber} — ${companyName}`,
      html: `
        <p>Bonjour ${customer.name},</p>
        <p>Veuillez trouver ci-joint la facture <strong>${invoice.invoiceNumber}</strong> d'un montant de <strong>${(invoice.total / 100).toFixed(2)} €</strong>, à régler avant le ${new Date(invoice.dueDate).toLocaleDateString('fr-FR')}.</p>
        <p>Cordialement,<br/>${companyName}</p>
      `,
      attachments: [
        {
          filename: buildInvoicePdfFilename(companyName, invoice.invoiceNumber),
          content: pdfBuffer,
        },
      ],
    });

    // Met aussi à jour le statut à SENT si c'était encore un brouillon
    if (invoice.status === 'DRAFT') {
      invoice.status = 'SENT';
      await invoice.save();
    }

    return res.status(200).json({ success: true, message: "Facture envoyée par email avec succès." });
  } catch (error) {
    next(error);
  }
};