import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Le nom est obligatoire"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: 6,
  },
  companyName: {
    type: String,
    trim: true,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationExpires: {
    type: Date,
  },
}, {
  timestamps: true // Crée automatiquement des champs createdAt et updatedAt
});

export const User = model('User', userSchema);