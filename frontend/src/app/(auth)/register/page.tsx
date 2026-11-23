"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { User, Building2, Mail, Lock, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';

// Ajustez ces 3 lignes si vos fichiers Shadcn sont rangés ailleurs
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import Image from "next/image";
import { useLanguage } from "@/lib/language";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

// Étape 1 : Notre propre algorithme de calcul de force (0 à 4)
const calculatePasswordStrength = (password: string): number => {
  if (!password) return 0;
  let score = 0;
  
  // Critères de sécurité
  if (password.length >= 6) score++; // Longueur de base
  if (password.length >= 10) score++; // Très long
  if (/[A-Z]/.test(password)) score++; // Contient une majuscule
  if (/[0-9]/.test(password)) score++; // Contient un chiffre
  if (/[^A-Za-z0-9]/.test(password)) score++; // Contient un caractère spécial

  // On limite le score maximum à 4
  if (score <= 1) return 1;
  if (score === 2) return 2;
  if (score === 3) return 3;
  return 4;
};

// Étape 2 : Couleurs de la jauge
const getScoreColor = (score: number): string => {
  if (score <= 1) return 'bg-red-500';
  if (score === 2) return 'bg-orange-500';
  if (score === 3) return 'bg-yellow-500';
  return 'bg-green-500';
};

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { t } = useLanguage();

  const handleSocialAuth = (provider: "google" | "github") => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://saas-facturation-backend-hb6b.onrender.com/api";
    window.location.href = `${apiBaseUrl}/auth/${provider}`;
  };

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      name: "",
      companyName: "",
      email: "",
      password: ""
    }
  });

  // Observation du mot de passe et calcul du score en direct
  const passwordValue = watch("password", "");
  const passwordScore = calculatePasswordStrength(passwordValue);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      await registerUser(data.name, data.email, data.password, data.companyName);
      router.push(`/check-email?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="absolute right-4 top-4 z-20"><LanguageSwitcher /></div>
      <Image
        src="/images/auth.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-slate-950/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_10%,_rgba(15,23,42,0.46)_100%)]" />

      <div className="relative z-10 w-full max-w-md rounded-[28px] border border-white/25 bg-white/88 p-7 shadow-[0_30px_90px_-30px_rgba(15,23,42,0.65)] backdrop-blur-[18px] sm:p-9">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("Créer un compte entreprise")}</h1>
            <p className="text-sm text-slate-500">{t("Centralisez factures, clients et suivi des paiements au sein de votre organisation.")}</p>
          </div>

          <SocialAuthButtons onSelect={handleSocialAuth} />

          <div className="relative my-4 flex items-center justify-center">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="mx-3 text-xs uppercase tracking-[0.2em] text-slate-400">{t("ou")}</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* CHAMP : NOM */}
            <div className="space-y-3">
              <Label htmlFor="name">{t("Nom complet")}</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input id="name" placeholder="Jean Dupont" className="pl-9" {...register("name", { required: t("Le nom est requis") })} />
              </div>
              {errors.name && <p className="text-sm text-destructive">{t(String(errors.name.message))}</p>}
            </div>

            {/* CHAMP : ENTREPRISE */}
            <div className="space-y-3">
              <Label htmlFor="companyName">{t("Entreprise")}</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input id="companyName" placeholder={t("Nom de l’entreprise")} className="pl-9" {...register("companyName")} />
              </div>
            </div>

            {/* CHAMP : EMAIL */}
            <div className="space-y-3">
              <Label htmlFor="email">{t("Email")}</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input id="email" type="email" placeholder={t("toi@exemple.com")} className="pl-10" {...register("email", { required: t("L'email est requis") })} />
              </div>
              {errors.email && <p className="text-sm text-destructive">{t(String(errors.email.message))}</p>}
            </div>

            {/* CHAMP : MOT DE PASSE */}
            <div className="space-y-3">
              <Label htmlFor="password">{t("Mot de passe")}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-9" 
                  {...register("password", { 
                    required: t("Le mot de passe est requis"),
                    minLength: { value: 6, message: t("Le mot de passe doit contenir au moins 6 caractères") }
                  })} 
                />
              </div>
              {errors.password && <p className="text-sm text-destructive">{t(String(errors.password.message))}</p>}

              {/* JAUGE DE FORCE MAISON */}
              {passwordValue && (
                <div className="space-y-1.5 pt-1">
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getScoreColor(passwordScore)}`} 
                      style={{ width: `${(passwordScore) * 25}%` as React.CSSProperties["width"] }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 flex justify-between items-center">
                    <span>{t("Force :")} 
                      <span className="font-semibold ml-1 text-slate-700">
                        {passwordScore === 1 && t("Faible ⚠️")}
                        {passwordScore === 2 && t("Moyen 🛠️")}
                        {passwordScore === 3 && t("Bon 👍")}
                        {passwordScore === 4 && t("Très sécurisé 💪")}
                      </span>
                    </span>
                    {passwordValue.length < 6 && (
                      <span className="text-red-500 font-medium">{t("Min. 6 caractères")}</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {error && <p className="text-sm text-destructive">{t(error)}</p>}

            <Button type="submit" className="w-full bg-[#2B3A67] hover:bg-[#1F2B4D]" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("S'inscrire")}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            {t("Déjà un compte ?")} 
            <Link href="/login" className="font-semibold text-[#2B3A67] underline-offset-4 hover:underline">
              {t("Se connecter")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}