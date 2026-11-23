"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, Lock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GradientBlobs } from "@/components/decorative/gradient-blobs";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/language";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

const schema = z
  .object({
    password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordcontent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setError(t("Ce lien est invalide ou a expiré."));
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password: data.password });
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(t(err.response?.data?.message || "Ce lien est invalide ou a expiré."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#F8FAFC]">
      <div className="absolute right-4 top-4 z-20"><LanguageSwitcher /></div>
      <GradientBlobs />

      <div className="hidden min-h-screen w-1/2 flex-col justify-center gap-8 bg-slate-900 px-8 py-16 lg:flex">
        <div className="max-w-md rounded-[2rem] bg-slate-900/75 p-10 text-white shadow-2xl shadow-slate-900/20 ring-1 ring-white/5">
          <span className="inline-flex rounded-full bg-[#C9A227]/20 px-3 py-1 text-xs uppercase tracking-[0.32em] text-[#C9A227]">
            {t("Réinitialisation")}
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">{t("Nouveau mot de passe")}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            {t("Choisissez un mot de passe robuste pour reprendre l’accès à votre espace sécurisé.")}
          </p>
          <div className="mt-8 space-y-4 rounded-[1.75rem] bg-slate-900/55 p-6 text-sm text-slate-300 ring-1 ring-white/5">
            <p className="font-medium text-white">{t("Protection renforcée")}</p>
            <p>{t("Un mot de passe plus sûr aide à protéger vos clients et vos factures.")}</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{t("Simple, clair, sans superflu")}</p>
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
            <div className="text-center">
              <Lock className="mx-auto h-10 w-10 text-[#2B3A67]" />
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">{t("Nouveau mot de passe")}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {t("Entre un mot de passe sécurisé pour finaliser la réinitialisation.")}
              </p>
            </div>

            <div className="mt-8">
              {!token ? (
                <div className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6 text-center text-sm text-red-700">
                  {t("Ce lien est invalide ou expiré. Demande un nouveau lien de réinitialisation.")}
                </div>
              ) : done ? (
                <div className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-6 text-center text-sm text-emerald-700">
                  <CheckCircle2 className="mx-auto mb-3 h-10 w-10" />
                  {t("Mot de passe réinitialisé. Vous allez être redirigé vers la connexion.")}
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="password">{t("Nouveau mot de passe")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input id="password" type="password" placeholder="••••••••" className="pl-9" {...register("password")} />
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{t(errors.password.message || "")}</p>}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword">{t("Confirmer le mot de passe")}</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input id="confirmPassword" type="password" placeholder="••••••••" className="pl-9" {...register("confirmPassword")} />
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-destructive">{t(errors.confirmPassword.message || "")}</p>}
                  </div>

                  {error && <p className="text-sm text-destructive">{t(error)}</p>}

                  <Button type="submit" className="w-full bg-[#2B3A67] hover:bg-[#1F2B4D]" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("Réinitialiser")}
                  </Button>
                </form>
              )}

              <Link href="/login" className="mt-6 block text-center text-sm font-medium text-[#2B3A67] hover:text-[#1F2B4D]">
                {t("Retour à la connexion")}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
export default function ResetPasswordPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">{t("Chargement...")}</div>}>
      <ResetPasswordcontent />
    </Suspense>
  );
}