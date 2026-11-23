"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/language";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export default function VerifyEmailPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    api
      .post("/auth/verify-email", { token })
      .then((res) => {
        const { token: authToken, ...user } = res.data;
        localStorage.setItem("token", authToken);
        localStorage.setItem("user", JSON.stringify(user));
        setStatus("success");
        setTimeout(() => router.push("/dashboard"), 1500);
      })
      .catch(() => setStatus("error"));
  }, [token, router]);

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
              {status === "loading" && <Loader2 className="mx-auto h-10 w-10 animate-spin text-slate-500" />}
              {status === "success" && <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />}
              {status === "error" && <XCircle className="mx-auto h-10 w-10 text-destructive" />}

              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
                {status === "loading" && t("Vérification en cours...")}
                {status === "success" && t("Email vérifié !")}
                {status === "error" && t("Lien invalide")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {status === "success" && t("Votre compte est activé et vous allez bientôt être redirigé vers le tableau de bord.")}
                {status === "loading" && t("Nous vérifions votre lien et activons votre espace.")}
                {status === "error" && t("Ce lien est invalide ou a expiré. Demandez un nouveau lien pour continuer.")}
              </p>
            </div>

            {status === "error" && (
              <div className="mt-8 text-center">
                <Link href="/check-email">
                  <Button variant="outline">{t("Demander un nouveau lien")}</Button>
                </Link>
              </div>
            )}
          </div>
      </motion.div>
    </main>
  );
}