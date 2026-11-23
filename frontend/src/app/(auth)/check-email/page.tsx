"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import Image from "next/image";
import { useLanguage } from "@/lib/language";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export const dynamic = "force-dynamic";
function CheckEmailcontent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post("/auth/resend-verification", { email });
      setResent(true);
      setTimeout(() => setResent(false), 4000);
    } finally {
      setResending(false);
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
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">{t("Vérifiez votre email")}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {t("Un lien de vérification a été envoyé à ")}<span className="font-medium text-slate-900">{email}</span>.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-center text-sm text-slate-600">
                {t("Cliquez sur le lien reçu pour activer votre compte et commencer votre gestion commerciale.")}
              </p>

              {resent ? (
                <div className="flex items-center justify-center gap-2 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  {t("Email renvoyé")}
                </div>
              ) : (
                <Button variant="outline" onClick={handleResend} disabled={resending} className="w-full">
                  {resending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("Renvoyer l'email")}
                </Button>
              )}

              <Link href="/login" className="block text-center text-sm font-medium text-[#2B3A67] hover:text-[#1F2B4D]">
                {t("Retour à la connexion")}
              </Link>
            </div>
          </div>
      </motion.div>
    </main>
  );
}
export default function CheckEmailPage() {
  const { t } = useLanguage();
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">{t("Chargement...")}</div>}>
      <CheckEmailcontent />
    </Suspense>
  );
}
