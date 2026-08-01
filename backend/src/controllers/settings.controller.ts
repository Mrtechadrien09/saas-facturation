import { Request, Response } from 'express';
import Settings from '../models/Settings.js'; // Ajuste le chemin selon ton projet

// 1. Récupérer les paramètres de l'utilisateur connecté
export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    // req.user.id provient de ton middleware d'authentification
    const settings = await Settings.findOne({ companyId: (req as any).user.userId });
    
    if (!settings) {
      // Si aucun paramètre n'existe, on renvoie un objet vide propre ou des valeurs par défaut
      res.status(200).json({ 
        settings: {
          companyInfo: { name: '' },
          address: { country: 'France' },
          financials: { currency: 'EUR', defaultVatRate: 20 }
        } 
      });
      return;
    }

    res.status(200).json({ settings });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des paramètres", error });
  }
};

// 2. Mettre à jour ou créer (Upsert) les paramètres
export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { companyInfo, address, financials } = req.body;

    // Validation rapide pour le champ obligatoire
    if (!companyInfo?.name) {
      res.status(400).json({ message: "La raison sociale de l'entreprise est obligatoire." });
      return;
    }

    const updatedSettings = await Settings.findOneAndUpdate(
      { companyId: (req as any).user.userId }, // Critère de recherche
      { 
        companyInfo, 
        address, 
        financials 
      },
      { new: true, upsert: true, runValidators: true } // Crée si n'existe pas, applique les validations du schéma
    );

    res.status(200).json({ 
      message: "Paramètres enregistrés avec succès.", 
      settings: updatedSettings 
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour des paramètres", error });
  }
};