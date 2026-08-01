"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GradientBlobs } from "@/components/decorative/gradient-blobs";
import { api } from "@/lib/api";

const schema = z.object({
  email: z.string().email("Email invalide"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setLoading(true);
    try {
      await api.post("/auth/forgot-password", data);
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Une erreur est survenue");
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
            Mot de passe oublié
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Récupère l’accès</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Nous t’enverrons un lien sécurisé pour retrouver l’accès à ton espace facturation.
          </p>
          <div className="mt-8 space-y-4 rounded-[1.75rem] bg-slate-900/55 p-6 text-sm text-slate-300 ring-1 ring-white/5">
            <p className="font-medium text-white">Sécurité et simplicité</p>
            <p>Un processus clair et sécurisé pour réinitialiser ton mot de passe.</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Facile et rapide</p>
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
              <Mail className="mx-auto h-10 w-10 text-[#2B3A67]" />
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">Mot de passe oublié</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Entre ton email et nous t’enverrons un lien pour définir un nouveau mot de passe.
              </p>
            </div>

            <div className="mt-8">
              {sent ? (
                <div className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-6 text-center text-sm text-emerald-700">
                  <CheckCircle2 className="h-10 w-10" />
                  <p>
                    Si cet email existe, un lien de réinitialisation a été envoyé. Vérifie ta boîte de réception.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input id="email" type="email" placeholder="toi@exemple.com" className="pl-10" {...register("email")} />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <Button type="submit" className="w-full bg-[#2B3A67] hover:bg-[#1F2B4D]" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Envoyer le lien"}
                  </Button>
                </form>
              )}

              <Link href="/login" className="mt-6 block text-center text-sm font-medium text-[#2B3A67] hover:text-[#1F2B4D]">
                Retour à la connexion
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}