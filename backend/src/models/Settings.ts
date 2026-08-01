import { Schema, model, Document } from 'mongoose';

export interface ISettings extends Document {
  companyId: string; // Liaison avec l'utilisateur/compte SaaS
  companyInfo: {
    name: string;
    siret?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
  address: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  financials: {
    currency: string;      // ex: "EUR", "USD"
    defaultVatRate: number; // ex: 20 (pour 20%)
  };
}

const SettingsSchema = new Schema<ISettings>({
  companyId: { type: String, required: true, unique: true, index: true },
  companyInfo: {
    name: { type: String, required: true, trim: true },
    siret: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    website: { type: String, trim: true }
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'France' }
  },
  financials: {
    currency: { type: String, required: true, default: 'EUR' },
    defaultVatRate: { type: Number, required: true, default: 20 }
  }
}, { timestamps: true });

export default model<ISettings>('Settings', SettingsSchema);