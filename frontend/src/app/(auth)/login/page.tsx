"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, Mail, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { GradientBlobs } from "@/components/decorative/gradient-blobs";
import Link from "next/link";



const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  useEffect(() => {
  if (cooldown <= 0) return;
  const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
  return () => clearInterval(timer);
}, [cooldown]);

  const onSubmit = async (data: LoginForm) => {
  setError(null);
  setRateLimited(false);
  setLoading(true);
  try {
    await login(data.email, data.password);
    router.push("/dashboard");
  } catch (err: any) {
    if (err.response?.data?.needsVerification) {
      router.push(`/check-email?email=${encodeURIComponent(data.email)}`);
      return;
    }
    if (err.response?.status === 429) {
      setRateLimited(true);
      setError(err.response?.data?.message || "Trop de tentatives. Réessaie plus tard.");
      setCooldown(15 * 60); // 15 min, synchronisé avec le backend
      return;
    }
    setError(err.response?.data?.message || "Email ou mot de passe incorrect");
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
            Simplifact
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Connexion à ton espace</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Accède à ton tableau de bord, suis tes factures et garde un oeil sur tes paiements en toute simplicité.
          </p>
          <div className="mt-8 space-y-4 rounded-[1.75rem] bg-slate-900/55 p-6 text-sm text-slate-300 ring-1 ring-white/5">
            <p className="font-medium text-white">Un espace clair pour ton activité</p>
            <p>Clients, factures, relances et paiements regroupés dans une interface fluide.</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Simple, rapide et professionnel</p>
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
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Se connecter</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Bienvenue de retour</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Entre dans ton espace Simplifact et reprends le contrôle de tes clients, devis et paiements.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

              {error && rateLimited && (
                <div className="flex items-start gap-2 rounded-3xl border border-red-200 bg-red-100/80 p-4 text-sm text-red-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {error && !rateLimited && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full bg-[#2B3A67] hover:bg-[#1F2B4D]" disabled={loading || cooldown > 0}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : cooldown > 0 ? (
                  `Réessaie dans ${Math.floor(cooldown / 60)}:${(cooldown % 60).toString().padStart(2, "0")}`
                ) : (
                  "Se connecter"
                )}
              </Button>
            </form>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link href="/forgot-password" className="text-center text-slate-600 transition hover:text-slate-950">
                Mot de passe oublié ?
              </Link>
              <p className="text-center text-sm text-slate-600">
                Pas encore de compte ?{" "}
                <Link href="/register" className="font-semibold text-[#2B3A67] underline-offset-4 hover:underline">
                  Créer un compte
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}