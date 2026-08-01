"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GradientBlobs } from "@/components/decorative/gradient-blobs";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";
export default function CheckEmailPage() {
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
    <div className="relative flex min-h-screen overflow-hidden bg-[#F8FAFC]">
      <GradientBlobs />

      <div className="flex w-full min-h-screen items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <div className="rounded-[2rem] border border-slate-200 bg-white/95 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.3)] backdrop-blur-xl sm:p-10">
            <div className="text-center">
              <Mail className="mx-auto h-10 w-10 text-[#2B3A67]" />
              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">Vérifie ton email</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Un lien de vérification a été envoyé à <span className="font-medium text-slate-900">{email}</span>.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <p className="text-center text-sm text-slate-600">
                Clique sur le lien reçu pour activer ton compte et démarrer ta facturation.
              </p>

              {resent ? (
                <div className="flex items-center justify-center gap-2 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Email renvoyé
                </div>
              ) : (
                <Button variant="outline" onClick={handleResend} disabled={resending} className="w-full">
                  {resending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Renvoyer l'email"}
                </Button>
              )}

              <Link href="/login" className="block text-center text-sm font-medium text-[#2B3A67] hover:text-[#1F2B4D]">
                Retour à la connexion
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}