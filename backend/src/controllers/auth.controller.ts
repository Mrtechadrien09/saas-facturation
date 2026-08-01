import dotenv from 'dotenv';
dotenv.config();
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
// Fonction utilitaire pour générer le JWT
const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET est obligatoire dans .env');
  }
  return jwt.sign({ userId: userId }, secret, { expiresIn: '30d' });
};

// 1. INSCRIPTION (Register)
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, companyName } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ message: 'Cet email est déjà utilisé' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      companyName,
      emailVerified: false,
      emailVerificationToken: hashedVerificationToken,
      emailVerificationExpires: new Date(Date.now() + 24 * 3600000), // 24h
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'Vérifie ton adresse email',
      html: `
        <p>Bonjour ${user.name},</p>
        <p>Merci de t'être inscrit. Clique sur le lien ci-dessous pour vérifier ton email (valide 24h) :</p>
        <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      `,
    });

    // Pas de token de connexion ici : l'utilisateur doit d'abord vérifier son email
    res.status(201).json({
      message: "Compte créé. Vérifie ton email pour activer ton compte.",
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription', error });
  }
};

// 2. CONNEXION (Login)
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }

    if (!user.emailVerified) {
      res.status(403).json({ message: 'Merci de vérifier ton email avant de te connecter.', needsVerification: true });
      return;
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      companyName: user.companyName,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la connexion', error });
  }
};

// 3. Demande de réinitialisation (envoie un email avec un lien)
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    // Toujours renvoyer un succès générique, même si l'email n'existe pas
    // (évite de révéler quels emails sont enregistrés)
    if (!user) {
      res.status(200).json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });
      return;
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 heure
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <p>Bonjour ${user.name},</p>
        <p>Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous (valide 1 heure) :</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
      `,
    });

    res.status(200).json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// 4. Réinitialisation effective du mot de passe
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: "Lien invalide ou expiré." });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Mot de passe réinitialisé avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Vérification de l'email via le lien reçu
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      res.status(400).json({ message: "Lien invalide ou expiré." });
      return;
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Email vérifié avec succès.",
      _id: user._id,
      name: user.name,
      email: user.email,
      companyName: user.companyName,
      token: generateToken(user._id.toString()),
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};

// Renvoyer un nouvel email de vérification
export const resendVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.emailVerified) {
      res.status(200).json({ message: "Si ce compte existe et n'est pas encore vérifié, un email a été envoyé." });
      return;
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    user.emailVerificationToken = hashedVerificationToken;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 3600000);
    await user.save();

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: user.email,
      subject: 'Vérifie ton adresse email',
      html: `<p>Voici ton nouveau lien de vérification (valide 24h) :</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });

    res.status(200).json({ message: "Si ce compte existe et n'est pas encore vérifié, un email a été envoyé." });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error });
  }
};