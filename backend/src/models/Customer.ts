import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  companyId: mongoose.Types.ObjectId; // L'utilisateur (SaaS) à qui appartient ce client
  name: string;
  email: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    zipCode?: string;
    country?: string;
  };
  createdAt: Date;
}

const CustomerSchema: Schema = new Schema(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true },
      zipCode: { type: String, trim: true },
      country: { type: String, trim: true },
    },
  },
  { timestamps: true }
);

// Un utilisateur ne peut pas avoir deux clients avec le même email
CustomerSchema.index({ companyId: 1, email: 1 }, { unique: true });

export const Customer = mongoose.model<ICustomer>('Customer', CustomerSchema);