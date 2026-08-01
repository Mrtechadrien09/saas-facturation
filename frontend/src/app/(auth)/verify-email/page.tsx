"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GradientBlobs } from "@/components/decorative/gradient-blobs";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";

export default function VerifyEmailPage() {
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
    <div className="relative flex min-h-screen overflow-hidden bg-[#F8FAFC]">
      <GradientBlobs />

      <div className="hidden min-h-screen w-1/2 flex-col justify-center gap-8 bg-slate-900 px-8 py-16 lg:flex">
        <div className="max-w-md rounded-[2rem] bg-slate-900/75 p-10 text-white shadow-2xl shadow-slate-900/20 ring-1 ring-white/5">
          <span className="inline-flex rounded-full bg-[#C9A227]/20 px-3 py-1 text-xs uppercase tracking-[0.32em] text-[#C9A227]">
            Vérification en cours
          </span>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight">Activation du compte</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Nous vérifions ton email et préparons ton tableau de bord pour un accès immédiat.
          </p>
          <div className="mt-8 space-y-4 rounded-[1.75rem] bg-slate-900/55 p-6 text-sm text-slate-300 ring-1 ring-white/5">
            <p className="font-medium text-white">Un accès protégé</p>
            <p>Ton compte sera activé rapidement pour que tu puisses reprendre la facturation.</p>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Clair, sécurisé, sans surcharge</p>
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
              {status === "loading" && <Loader2 className="mx-auto h-10 w-10 animate-spin text-slate-500" />}
              {status === "success" && <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />}
              {status === "error" && <XCircle className="mx-auto h-10 w-10 text-destructive" />}

              <h2 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">
                {status === "loading" && "Vérification en cours..."}
                {status === "success" && "Email vérifié !"}
                {status === "error" && "Lien invalide"}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {status === "success" && "Ton compte est activé et tu vas bientôt être redirigé vers le dashboard."}
                {status === "loading" && "Nous vérifions ton lien et activons ton espace."}
                {status === "error" && "Ce lien est invalide ou a expiré. Demande un nouveau lien pour continuer."}
              </p>
            </div>

            {status === "error" && (
              <div className="mt-8 text-center">
                <Link href="/check-email">
                  <Button variant="outline">Demander un nouveau lien</Button>
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}