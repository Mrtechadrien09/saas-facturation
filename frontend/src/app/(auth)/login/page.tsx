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
import { useAuth } from "@/hooks/use-auth";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/language";
import { LanguageSwitcher } from "@/components/layout/language-switcher";



const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSocialAuth = (provider: "google" | "github") => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://saas-facturation-backend-hb6b.onrender.com/api";
    window.location.href = `${apiBaseUrl}/auth/${provider}`;
  };

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

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
          <div className="rounded-[28px] border border-white/25 bg-white/88 p-7 shadow-[0_30px_90px_-30px_rgba(15,23,42,0.65)] backdrop-blur-[18px] sm:p-9">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{t("Se connecter")}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">{t("Connexion à votre espace")}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {t("Accédez à vos données commerciales, vos factures et votre suivi de trésorerie en quelques secondes.")}
              </p>
            </div>

            <SocialAuthButtons onSelect={handleSocialAuth} />

            <div className="relative my-4 flex items-center justify-center">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="mx-3 text-xs uppercase tracking-[0.2em] text-slate-400">{t("ou")}</span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="email">{t("Email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input id="email" type="email" placeholder={t("toi@exemple.com")} className="pl-10" {...register("email")} />
                </div>
                {errors.email && <p className="text-sm text-destructive">{t(errors.email.message || "")}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="password">{t("Mot de passe")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-9" {...register("password")} />
                </div>
                {errors.password && <p className="text-sm text-destructive">{t(errors.password.message || "")}</p>}
              </div>

              {error && rateLimited && (
                <div className="flex items-start gap-2 rounded-3xl border border-red-200 bg-red-100/80 p-4 text-sm text-red-700">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {error && !rateLimited && <p className="text-sm text-destructive">{t(error)}</p>}

              <Button type="submit" className="w-full bg-[#2B3A67] hover:bg-[#1F2B4D]" disabled={loading || cooldown > 0}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : cooldown > 0 ? (
                  `${t("Réessaie dans")} ${Math.floor(cooldown / 60)}:${(cooldown % 60).toString().padStart(2, "0")}`
                ) : (
                  t("Se connecter")
                )}
              </Button>
            </form>

            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link href="/forgot-password" className="text-center text-slate-600 transition hover:text-slate-950">
                {t("Mot de passe oublié ?")}
              </Link>
              <p className="text-center text-sm text-slate-600">
                {t("Pas encore de compte ?")} 
                <Link href="/register" className="font-semibold text-[#2B3A67] underline-offset-4 hover:underline">
                  {t("Créer un compte")}
                </Link>
              </p>
            </div>
          </div>
      </motion.div>
    </main>
  );
}