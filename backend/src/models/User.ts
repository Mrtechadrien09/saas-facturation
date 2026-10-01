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
    // MODIFICATION : Le mot de passe est obligatoire SEULEMENT s'il n'y a pas d'ID Google ou GitHub
    required: [
      function(this: any) { return !this.googleId && !this.githubId; }, 
      "Le mot de passe est obligatoire"
    ],
    minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"],
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
  // --- ENTRAIDE GOOGLE & GITHUB (AJOUTÉ) ---
  googleId: { 
    type: String, 
    unique: true, 
    sparse: true // Évite les conflits d'unicité avec les utilisateurs classiques
  },
  githubId: { 
    type: String, 
    unique: true, 
    sparse: true // Évite les conflits d'unicité avec les utilisateurs classiques
  },
  avatar: { 
    type: String // Pour récupérer la photo de profil sociale
  },
}, {
  timestamps: true // Crée automatiquement des champs createdAt et updatedAt
});

export const User = model('User', userSchema);