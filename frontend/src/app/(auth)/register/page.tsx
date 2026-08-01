"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, User, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { GradientBlobs } from "@/components/decorative/gradient-blobs";

const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  companyName: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
  setError(null);
  setLoading(true);
  try {
    await registerUser(data.name, data.email, data.password, data.companyName);
    router.push(`/check-email?email=${encodeURIComponent(data.email)}`);
  } catch (err: any) {
    setError(err.response?.data?.message || "Erreur lors de l'inscription");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#F8FAFC]">
      <GradientBlobs />

      <div className="hidden min-h-screen w-1/2 flex-col justify-center gap-8 bg-slate-900 px-8 py-16 lg:flex">
        <div className="max-w-md rounded-[2rem] bg-slate-900/75 p-10 text-white shadow-2xl shadow-slate-900/20 ring-1 ring-white/5">
          <span className="inline-flex rounded-full bg-[#C9A227]/20 px-3 py-1 text-xs uppercase tracking-[0.32em] text-[#C9A227]">
            Inscription rapide
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Rejoins un espace pro</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Crée ton compte pour centraliser tes clients, tes factures et suivre chaque paiement facilement.
          </p>
          <div className="mt-8 space-y-4 rounded-[1.75rem] bg-slate-900/55 p-6 text-sm text-slate-300 ring-1 ring-white/5">
            <p className="font-medium text-white">Ton espace Simplifact</p>
            <p>Des fiches clients claires, des relances simples et des factures prêtes à envoyer.</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Sans fioritures, juste utile</p>
          </div>
        </div>
      </div>

      <div className="flex w-full min-h-screen items-center justify-center px-4 py-16 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.3)] backdrop-blur-xl sm:p-10">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Créer un compte</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Commence avec Simplifact</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Inscris-toi et profite d’un tableau de bord clair pour tes clients, tes relances et tes paiements avec Simplifact.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="name">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input id="name" placeholder="Jean Dupont" className="pl-9" {...register("name")} />
                </div>
                {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="companyName">Entreprise (optionnel)</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input id="companyName" placeholder="Mon Entreprise SARL" className="pl-9" {...register("companyName")} />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input id="email" type="email" placeholder="toi@exemple.com" className="pl-10" {...register("email")} />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-9" {...register("password")} />
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
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
        </motion.div>
      </div>
    </div>
  );
}