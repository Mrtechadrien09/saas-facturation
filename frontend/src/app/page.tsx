"use client";

import { useEffect, useState, memo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Users,
  Zap,
  ShieldCheck,
  ArrowRight,
  Receipt,
  CheckCircle2,
  UserPlus,
  FilePlus,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";

const features = [
  {
    icon: FileText,
    title: "Simplifact",
    description:
      "Crée des factures professionnelles en quelques clics. Mentions légales, numérotation et totaux sont gérés pour toi — tu te concentres sur le contenu.",
  },
  {
    icon: Users,
    title: "Gestion clients",
    description:
      "Centralise coordonnées, adresses et historique. Retrouve n’importe quel client en quelques secondes, sans tableur ni dossier éparpillé.",
  },
  {
    icon: Zap,
    title: "Suivi en temps réel",
    description:
      "Tableau de bord clair : revenu, factures en attente, retards. Tu sais toujours où en est ta trésorerie, sans tout recalculer à la main.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurisé",
    description:
      "Compte protégé, vérification email et accès personnel. Tes données restent les tiennes — accessibles uniquement depuis ton espace.",
  },
];

const steps = [
  {
    icon: UserPlus,
    title: "Ajoute tes clients",
    description:
      "Renseigne une fois nom, email et adresse. Ces infos seront réutilisées à chaque facture, sans ressaisie.",
  },
  {
    icon: FilePlus,
    title: "Crée une facture",
    description:
      "Ajoute tes lignes, choisis le taux de TVA : HT, TVA et TTC se calculent seuls. Ta facture est prête en moins d’une minute.",
  },
  {
    icon: CreditCard,
    title: "Envoie et suis les paiements",
    description:
      "Envoie le PDF par email en un clic, puis suis le statut — brouillon, envoyée, payée ou en retard — jusqu’au règlement.",
  },
];

const audiences = [
  {
    title: "Indépendants & freelances",
    text: "Tu factures au fil des missions. Un outil simple te laisse plus de temps pour ton métier, pas pour l’administratif.",
  },
  {
    title: "Petites structures",
    text: "Plusieurs clients, plusieurs échéances. Tout reste centralisé : qui a payé, qui est en retard, combien tu as facturé.",
  },
  {
    title: "Ceux qui quittent Excel",
    text: "Fini les modèles copiés-collés et les erreurs de formules. Une facture propre, numérotée, prête à envoyer.",
  },
];

const testimonials = [
  {
    name: "Camille R.",
    role: "Graphiste freelance",
    text: "Avant je passais 20 minutes sur Word pour chaque facture. Maintenant c’est prêt en 2 clics, et mes clients reçoivent un PDF pro. Un vrai gain de temps.",
  },
  {
    name: "Thomas L.",
    role: "Consultant indépendant",
    text: "Le suivi des paiements m’a changé la vie. Je vois immédiatement qui a payé et qui est en retard. Plus besoin de relancer à l’aveugle.",
  },
  {
    name: "Léa M.",
    role: "Photographe",
    text: "Simple, clair, et la TVA se calcule toute seule. J’ai quitté Excel sans regret. Exactement ce qu’il me fallait pour démarrer.",
  },
];

const faqs = [
  {
    question: "Mes données sont-elles en sécurité ?",
    answer:
      "Oui. Chaque compte est isolé, protégé par mot de passe et vérification par email. Seul toi (et les personnes à qui tu donnes accès) pouvez consulter tes clients et tes factures.",
  },
  {
    question: "Puis-je utiliser l'app avec plusieurs clients ?",
    answer:
      "Oui, sans limite artificielle. Ajoute autant de clients que nécessaire, filtre tes factures, et retrouve l’historique de chacun depuis sa fiche.",
  },
  {
    question: "Est-ce que je peux envoyer mes factures directement par email ?",
    answer:
      "Oui. Depuis le détail d’une facture, un envoi par email joint le PDF. Ton client reçoit un document clair, et le statut passe à « envoyée ».",
  },
  {
    question: "Le calcul de la TVA est-il automatique ?",
    answer:
      "Oui. Tu indiques le taux par ligne (par ex. 20 %). Les montants HT, TVA et TTC sont recalculés à chaque modification — plus d’erreur de saisie.",
  },
  {
    question: "Puis-je télécharger mes factures en PDF ?",
    answer:
      "Oui. Chaque facture se télécharge en PDF, prête à archiver ou à transmettre. Le même fichier part en pièce jointe lors de l’envoi par email.",
  },
  {
    question: "Est-ce vraiment gratuit pour commencer ?",
    answer:
      "Oui. Tu crées ton compte sans carte bancaire. L’objectif est que tu puisses facturer correctement dès le premier jour, sans friction.",
  },
];

const FaqItem = memo(function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 py-4">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left font-medium text-slate-800"
      >
        {question}
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-[#C9A227] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 text-sm leading-relaxed text-slate-600"
        >
          {answer}
        </motion.p>
      )}
    </div>
  );
});

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, init } = useAuth();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    init();
    setChecked(true);
  }, [init]);

  useEffect(() => {
    if (checked && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [checked, isAuthenticated, router]);

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-slate-800">
      {/* ========== NAV ========== */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur-md sm:px-10">
        <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2B3A67] text-sm font-bold text-white">
              S
            </div>
            <span className="font-semibold tracking-tight text-[#2B3A67]">
              Simplifact
            </span>
        </div>

        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-[#2B3A67]">
            Fonctionnalités
          </a>
          <a href="#comment-ca-marche" className="transition hover:text-[#2B3A67]">
            Comment ça marche
          </a>
          <a href="#temoignages" className="transition hover:text-[#2B3A67]">
            Témoignages
          </a>
          <a href="#faq" className="transition hover:text-[#2B3A67]">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-slate-700 hover:bg-slate-100"
            >
              Connexion
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-[#2B3A67] text-white hover:bg-[#1f2a4d]">
              Commencer
            </Button>
          </Link>
        </div>
      </header>

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero.jpg"
            alt="Interface Simplifact pour freelances et indépendants"
            fill
            priority
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            className="object-cover object-[center_35%] brightness-[0.6] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/50 to-slate-900/30" />
          <div className="absolute left-[-10%] top-10 h-80 w-80 rounded-full bg-[#C9A227]/15 blur-3xl" />
          <div className="absolute right-0 top-1/4 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:py-28">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-slate-100"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A227]/20 text-[#C9A227]">
                <Zap className="h-4 w-4" />
              </span>
              Pour freelances, TPE et indépendants • Gratuit sans CB
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-8 max-w-xl text-5xl font-semibold tracking-tight text-white sm:text-6xl"
            >
              Simplifact, sans perte de temps
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-6 max-w-xl text-lg leading-8 text-slate-200"
            >
              Centralise tes clients, génère tes factures, et retrouve l’état de tes paiements en un coup d’œil — tout depuis un seul tableau de bord.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-[#C9A227] text-slate-950 shadow-lg shadow-[#C9A227]/20 hover:bg-[#d6af2b]"
                >
                  Créer un compte gratuit
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                >
                  Se connecter
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.32 }}
              className="mt-10 grid gap-4 sm:grid-cols-3"
            >
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <p className="text-3xl font-semibold text-white">120+</p>
                <p className="mt-2 text-sm text-slate-300">Freelances organisés</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <p className="text-3xl font-semibold text-white">3 000+</p>
                <p className="mt-2 text-sm text-slate-300">factures créées</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <p className="text-3xl font-semibold text-white">96%</p>
                <p className="mt-2 text-sm text-slate-300">clients satisfaits</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.7)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.16),_transparent_45%),_radial-gradient(circle_at_bottom_left,_rgba(245,158,11,0.14),_transparent_40%)]" />
              <div className="relative p-6 sm:p-8">
                <div className="flex items-center justify-between gap-4 rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-200 shadow-sm">
                  <div>
                    <p className="text-xs uppercase tracking-[0.32em] text-slate-400">Dashboard</p>
                    <p className="mt-1 text-sm font-semibold text-white">Suivi de facturation</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                    En ligne
                  </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Factures</p>
                    <p className="mt-3 text-3xl font-semibold text-white">18</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">Ce mois-ci</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Paiements reçus</p>
                    <p className="mt-3 text-3xl font-semibold text-white">12</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.25em] text-slate-500">En attente</p>
                  </div>
                </div>

                <div className="mt-6 overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-4 text-sm text-slate-300 shadow-sm">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.24em] text-slate-500">
                    <span>Factures récentes</span>
                    <span>Dernières 24h</span>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="rounded-3xl bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                        <span>#0012</span>
                        <span className="rounded-full bg-emerald-500/15 px-2 py-1 text-emerald-300">Payée</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-200">Graphisme • 1 250€</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950/60 p-4">
                      <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                        <span>#0013</span>
                        <span className="rounded-full bg-amber-500/15 px-2 py-1 text-amber-300">En retard</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-200">Maintenance • 420€</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Clients actifs</p>
                    <p className="mt-3 text-2xl font-semibold text-white">14</p>
                  </div>
                  <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/80 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Prochaine relance</p>
                    <p className="mt-3 text-2xl font-semibold text-white">2</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== DASHBOARD CAPTURE ========== */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_70px_-40px_rgba(15,23,42,0.2)] overflow-hidden">
          <div className="bg-slate-950 px-6 py-6 text-white sm:px-10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Capture du dashboard</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ce que voit vraiment l’utilisateur après connexion
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              Un aperçu visuel du tableau de bord aide à rassurer : suivi des factures, clients actifs et factures en attente.
            </p>
          </div>

          <div className="bg-slate-50 p-6 sm:p-8">
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-950 px-5 py-4 text-sm text-slate-100">
                Tableau de bord Simplifact
              </div>

              <img
                src="/images/preuve.jpg"
                alt="Capture d'écran du tableau de bord Simplifact"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="text-sm uppercase tracking-[0.3em] text-slate-500"
          >
            Ce dont tu as vraiment besoin
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
          >
            Gère ta facturation comme un pro, sans complexité.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 text-sm leading-7 text-slate-600 sm:text-base"
          >
            Des fonctionnalités claires, un tableau de bord lisible et des factures prêtes à envoyer en quelques clics.
          </motion.p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.18)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_rgba(15,23,42,0.22)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#E9F4FF] text-[#2B3A67] shadow-sm">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
            <div className="h-px bg-slate-200/80" />
            <p className="text-center text-sm uppercase tracking-[0.35em] text-slate-500">
              Ils nous font confiance
            </p>
            <div className="h-px bg-slate-200/80" />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-2xl font-semibold text-slate-900">120+</p>
              <p className="mt-2 text-sm text-slate-500">freelances organisés</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-2xl font-semibold text-slate-900">3 000+</p>
              <p className="mt-2 text-sm text-slate-500">factures créées</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-2xl font-semibold text-slate-900">96%</p>
              <p className="mt-2 text-sm text-slate-500">clients satisfaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== POUR QUI ========== */}
      <section className="bg-white px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Pour qui
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Conçu pour les artisans du digital, les micros et petites structures.
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {audiences.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.35)]"
              >
                <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMMENT ÇA MARCHE ========== */}
      <section id="comment-ca-marche" className="bg-slate-50 px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Comment ça marche
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Trois étapes simples pour démarrer rapidement.
            </h2>
          </motion.div>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_22px_70px_-45px_rgba(15,23,42,0.3)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#C9A227]/15 text-[#C9A227]">
                    <span className="text-lg font-semibold">{i + 1}</span>
                  </div>
                  <div className="mt-5 inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-[#2B3A67]/10 text-[#2B3A67]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== AVANT / APRÈS ========== */}
      <section className="bg-white px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              Avant / Après
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Passe d’un processus artisanal à un système fluide.
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="rounded-[2rem] border border-red-200 bg-red-50/70 p-8"
            >
              <h3 className="font-semibold text-red-700">Sans outil dédié</h3>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-1 text-red-500">✕</span>
                  Factures faites à la main, modèles dispersés et erreurs fréquentes.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 text-red-500">✕</span>
                  Calculs manuels de TVA et suivi des paiements impossible.
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 text-red-500">✕</span>
                  Relances improvisées et historique client incomplet.
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="rounded-[2rem] border border-slate-200 bg-slate-50 p-8"
            >
              <h3 className="font-semibold text-slate-900">Avec Simplifact</h3>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#C9A227]" />
                  Factures prêtes en quelques clics, avec toutes les mentions légales.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#C9A227]" />
                  TVA automatique et suivi de paiement intégré.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#C9A227]" />
                  Clients centralisés, relances plus simples et reporting clair.
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== TÉMOIGNAGES ========== */}
      <section id="temoignages" className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-3xl font-semibold tracking-tight text-slate-900"
          >
            Ils facturent déjà avec nous
          </motion.h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex gap-1 text-[#C9A227]">
                  {[...Array(5)].map((_, star) => (
                    <svg
                      key={star}
                      className="h-4 w-4 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  « {t.text} »
                </p>

                <div className="mt-5">
                  <p className="font-medium text-slate-800">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section id="faq" className="border-t border-slate-200 bg-white px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-3xl font-semibold tracking-tight text-slate-900"
          >
            Questions fréquentes
          </motion.h2>

          <div className="mt-10">
            {faqs.map((faq) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA FINAL ========== */}
      <section className="relative overflow-hidden px-6 py-24 text-center">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(43,58,103,0.07), transparent)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Prêt à simplifier ta facturation ?
          </h2>
          <p className="mt-3 text-slate-600">
            Crée ton compte gratuitement, aucune carte bancaire requise.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="mt-6 bg-[#2B3A67] text-white shadow-lg shadow-[#2B3A67]/20 hover:bg-[#1f2a4d]"
            >
              Créer un compte gratuit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-12 text-slate-300">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-lg font-semibold text-white">Simplifact</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400">
              Une application claire et professionnelle pour facturer, gérer tes clients et suivre tes paiements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <Link href="/login" className="transition hover:text-white">
              Connexion
            </Link>
            <Link href="/register" className="transition hover:text-white">
              Inscription
            </Link>
            <a href="#features" className="transition hover:text-white">
              Fonctionnalités
            </a>
            <a href="#faq" className="transition hover:text-white">
              FAQ
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Simplifact. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}