"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { User, Building2, Mail, Lock, Loader2 } from 'lucide-react';

// Ajustez ces 3 lignes si vos fichiers Shadcn sont rangés ailleurs
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
      console.log("Données envoyées :", data);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Créer un compte</h1>
            <p className="text-sm text-slate-500">Commencez à gérer vos factures dès aujourd'hui</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* CHAMP : NOM */}
            <div className="space-y-3">
              <Label htmlFor="name">Nom complet</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input id="name" placeholder="Jean Dupont" className="pl-9" {...register("name", { required: "Le nom est requis" })} />
              </div>
              {errors.name && <p className="text-sm text-destructive">{String(errors.name.message)}</p>}
            </div>

            {/* CHAMP : ENTREPRISE */}
            <div className="space-y-3">
              <Label htmlFor="companyName">Entreprise (optionnel)</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input id="companyName" placeholder="Mon Entreprise SARL" className="pl-9" {...register("companyName")} />
              </div>
            </div>

            {/* CHAMP : EMAIL */}
            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input id="email" type="email" placeholder="toi@exemple.com" className="pl-10" {...register("email", { required: "L'email est requis" })} />
              </div>
              {errors.email && <p className="text-sm text-destructive">{String(errors.email.message)}</p>}
            </div>

            {/* CHAMP : MOT DE PASSE */}
            <div className="space-y-3">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-9" 
                  {...register("password", { 
                    required: "Le mot de passe est requis",
                    minLength: { value: 6, message: "Le mot de passe doit contenir au moins 6 caractères" }
                  })} 
                />
              </div>
              {errors.password && <p className="text-sm text-destructive">{String(errors.password.message)}</p>}

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
                    <span>Force : 
                      <span className="font-semibold ml-1 text-slate-700">
                        {passwordScore === 1 && "Faible ⚠️"}
                        {passwordScore === 2 && "Moyen 🛠️"}
                        {passwordScore === 3 && "Bon 👍"}
                        {passwordScore === 4 && "Très sécurisé 💪"}
                      </span>
                    </span>
                    {passwordValue.length < 6 && (
                      <span className="text-red-500 font-medium">Min. 6 caractères</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full bg-[#2B3A67] hover:bg-[#1F2B4D]" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "S'inscrire"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            Déjà un compte ?{" "}
            <Link href="/login" className="font-semibold text-[#2B3A67] underline-offset-4 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}