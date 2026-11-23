"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import Image from "next/image";
import { useLanguage } from "@/lib/language";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

const schema = z.object({
  email: z.string().email("Email invalide"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const { t } = useLanguage();
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
      setError(t(err.response?.data?.message || "Une erreur est survenue"));
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
            <div className="text-center">
              <Mail className="mx-auto h-10 w-10 text-[#2B3A67]" />
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">{t("Mot de passe oublié")}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {t("Saisissez votre email pour recevoir un lien de réinitialisation sécurisé.")}
              </p>
            </div>

            <div className="mt-8">
              {sent ? (
                <div className="flex flex-col items-center gap-3 rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-6 text-center text-sm text-emerald-700">
                  <CheckCircle2 className="h-10 w-10" />
                  <p>
                    {t("Si cet email existe, un lien de réinitialisation a été envoyé. Vérifiez votre boîte mail.")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-3">
                    <Label htmlFor="email">{t("Email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input id="email" type="email" placeholder={t("toi@exemple.com")} className="pl-10" {...register("email")} />
                    </div>
                    {errors.email && <p className="text-sm text-destructive">{t(errors.email.message || "")}</p>}
                  </div>

                  {error && <p className="text-sm text-destructive">{t(error)}</p>}

                  <Button type="submit" className="w-full bg-[#2B3A67] hover:bg-[#1F2B4D]" disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : t("Envoyer le lien")}
                  </Button>
                </form>
              )}

              <Link href="/login" className="mt-6 block text-center text-sm font-medium text-[#2B3A67] hover:text-[#1F2B4D]">
                {t("Retour à la connexion")}
              </Link>
            </div>
          </div>
      </motion.div>
    </main>
  );
}