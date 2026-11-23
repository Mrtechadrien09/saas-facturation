"use client";

import { useEffect, useRef, useState, memo } from "react";
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
import { getTokenFromUrl, clearTokenFromUrl } from "@/lib/auth-token.mjs";
import Image from "next/image";
import { useLanguage } from "@/lib/language";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
const features = [
  {
    icon: FileText,
    title: "Facturation professionnelle",
    description:
      "Générez des factures conformes, avec mentions légales, numérotation et montants calculés automatiquement pour votre organisation.",
  },
  {
    icon: Users,
    title: "Gestion clients & comptes",
    description:
      "Centralisez les informations de vos clients, filiales et partenaires avec un historique clair et un accès structuré par équipe.",
  },
  {
    icon: Zap,
    title: "Suivi de trésorerie",
    description:
      "Visualisez les encaissements, les relances et les factures en attente pour piloter votre cash-flow avec précision.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité & conformité",
    description:
      "Accès contrôlé, vérification des comptes et environnement conçu pour les équipes internes et les organisations B2B.",
  },
];

const steps = [
  {
    icon: UserPlus,
    title: "Importez vos clients",
    description:
      "Ajoutez rapidement vos entreprises, contacts et adresses pour centraliser les informations de votre pipeline commercial.",
  },
  {
    icon: FilePlus,
    title: "Créez vos factures",
    description:
      "Ajoutez les lignes, les taux de TVA, les conditions de paiement et générez des factures prêtes à envoyer en quelques clics.",
  },
  {
    icon: CreditCard,
    title: "Suivez les paiements",
    description:
      "Surveillez les statuts, relancez les impayés et gardez une vue fiable sur l’état de votre trésorerie d’entreprise.",
  },
];

const audiences = [
  {
    title: "PME & ETI",
    text: "Un outil de facturation robuste pour structurer les processus comptables et commerciaux sans dépendre de fichiers dispersés.",
  },
  {
    title: "Agences & services",
    text: "Centralisez les clients, les prestations et les relances pour gagner en réactivité et en visibilité sur les missions en cours.",
  },
  {
    title: "Équipes finance & opérations",
    text: "Offrez à vos équipes une base unique pour piloter la facturation, les encaissements et les suivis internes de manière fiable.",
  },
];

const testimonials = [
  {
    name: "Camille R.",
    role: "Directrice financière",
    text: "Nous avons standardisé la facturation de nos clients en quelques semaines. Le suivi des paiements est désormais clair et exploitable par toute l’équipe.",
  },
  {
    name: "Thomas L.",
    role: "Responsable comptabilité",
    text: "L’outil nous aide à éviter les erreurs de suivi et à relancer rapidement les impayés. L’expérience est simple, propre et adaptée à une organisation.",
  },
  {
    name: "Léa M.",
    role: "Chef d’agence",
    text: "La facturation est devenue fluide et beaucoup plus lisible pour nos équipes. Nous gagnons du temps sur les tâches administratives sans perdre la qualité.",
  },
];

const faqs = [
  {
    question: "Nos données sont-elles sécurisées ?",
    answer:
      "Oui. Chaque compte est isolé et protégé par mot de passe, vérification d’email et accès structuré pour les équipes internes.",
  },
  {
    question: "L’outil convient-il à plusieurs utilisateurs ?",
    answer:
      "Oui. Il est conçu pour les entreprises qui souhaitent centraliser les clients, les factures et les suivis entre plusieurs profils et départements.",
  },
  {
    question: "Peut-on envoyer des factures directement par email ?",
    answer:
      "Oui. Les factures peuvent être générées puis envoyées directement depuis l’interface, avec un historique clair et un statut suivi par l’équipe.",
  },
  {
    question: "Le calcul de la TVA est-il automatique ?",
    answer:
      "Oui. Vous définissez le taux applicable et le système calcule automatiquement les montants HT, TVA et TTC pour chaque facture.",
  },
  {
    question: "Le SaaS est-il adapté à une structure PME / ETI ?",
    answer:
      "Oui. La solution a été pensée pour les organisations qui veulent une gestion plus claire, plus rapide et plus fiable de leurs transactions commerciales.",
  },
  {
    question: "Peut-on commencer sans procédure complexe ?",
    answer:
      "Oui. Vous pouvez créer votre compte et démarrer rapidement, sans friction ni configuration lourde, puis évoluer selon vos besoins.",
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
  const { t } = useLanguage();

  return (
    <div className="border-b border-slate-200 py-4">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left font-medium text-slate-800"
      >
        {t(question)}
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
          {t(answer)}
        </motion.p>
      )}
    </div>
  );
});

function TypewriterHeadline({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayedText(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 35);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="inline-flex items-center gap-2">
      {displayedText}
      <span className="inline-block h-10 w-[2px] animate-pulse rounded-full bg-[#C9A227] align-middle" />
    </span>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, init, completeSocialLogin } = useAuth();
  const { t } = useLanguage();
  const [checked, setChecked] = useState(false);
  const [shouldLoadDemoVideo, setShouldLoadDemoVideo] = useState(false);
  const demoVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = demoVideoRef.current;
    if (!video) return;

    if (!('IntersectionObserver' in window)) {
      setShouldLoadDemoVideo(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoadDemoVideo(true);
        observer.disconnect();
      }
    }, { rootMargin: '250px' });

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (shouldLoadDemoVideo) {
      demoVideoRef.current?.load();
    }
  }, [shouldLoadDemoVideo]);

  useEffect(() => {
    const tokenFromUrl = getTokenFromUrl(window.location.search);

    const handleAuth = async () => {
      if (tokenFromUrl) {
        await completeSocialLogin(tokenFromUrl);
        const nextPath = clearTokenFromUrl(window.location.href);
        window.history.replaceState({}, "", nextPath);
        setChecked(true);
        return;
      }

      init();
      setChecked(true);
    };

    void handleAuth();
  }, [completeSocialLogin, init]);

  useEffect(() => {
    if (checked && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [checked, isAuthenticated, router]);

  return (
    <div
      className="relative min-h-screen bg-[#EEF4F0] text-slate-800 pt-11"
      style={{
        backgroundImage: "radial-gradient(ellipse 32rem 72rem at 0% 22%, rgba(43,58,103,0.055), transparent 68%), radial-gradient(ellipse 32rem 72rem at 100% 78%, rgba(201,162,39,0.075), transparent 68%)",
      }}
    >
      {/* ========== BANDEAU PROMOTIONNEL ========== */}
      <div
        className="landing-marquee fixed inset-x-0 top-0 z-40 h-11 overflow-hidden border-b border-[#C9A227]/30 bg-[#171F38] text-white shadow-[0_8px_30px_-18px_rgba(15,23,42,0.85)]"
        aria-label="Avantages Simplifact"
      >
        <div className="landing-marquee-track flex h-full items-center">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {[
                t("Essayez gratuitement pendant 1 mois"),
                t("Sans carte bancaire"),
                t("Sans engagement"),
                t("Votre première facture en deux minutes"),
                t("Relances automatiques des impayés"),
              ].map((message) => (
                <span key={message} className="flex shrink-0 items-center whitespace-nowrap px-5 text-xs font-semibold tracking-[0.01em] text-slate-100 sm:px-8 sm:text-sm">
                  {message}
                  <span className="ml-5 h-1 w-1 rounded-full bg-[#C9A227] shadow-[0_0_8px_rgba(201,162,39,0.8)] sm:ml-8" aria-hidden="true" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ========== NAV ========== */}
      <header className="sticky top-11 z-20 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 py-4 backdrop-blur-md sm:px-10">
        <div className="flex items-center gap-2">
            <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#2B3A67] text-sm font-bold text-white">
              S
            </div>
            <span className="font-semibold tracking-tight text-[#2B3A67]">
              Simplifact
            </span>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-slate-700 hover:bg-slate-100"
            >
              {t("Connexion")}
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-[#2B3A67] text-white hover:bg-[#1f2a4d]">
              {t("Commencer")}
            </Button>
          </Link>
        </div>
      </header>

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0">
          <div className="grid-pattern absolute inset-0 opacity-30" aria-hidden="true" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(201,162,39,0.18),_transparent_35%)]" />
          <Image
            src="/images/hero.jpg"
            alt={t("Interface Simplifact pour entreprises et équipes de gestion")}
            fill
            priority
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
            className="object-cover object-[center_35%] brightness-[0.52] contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-950/70 to-slate-900/50" />
          <div className="animate-drift absolute -left-20 top-16 h-72 w-72 rounded-full bg-[#C9A227]/20 blur-3xl" />
          <div className="animate-float-slow absolute right-0 top-1/4 h-80 w-80 rounded-full bg-sky-400/20 blur-3xl" />
          <div className="animate-float absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:py-28 xl:grid-cols-[minmax(0,1fr)_560px]">
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
              {t("Solution de facturation pour PME, ETI et équipes commerciales")}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="mt-8 max-w-xl text-5xl font-semibold tracking-tight text-white sm:text-6xl"
            >
              <TypewriterHeadline text={t("Simplifiez la facturation de votre entreprise")} />
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="mt-6 max-w-xl text-lg leading-8 text-slate-200"
            >
              {t("Centralisez vos clients, vos factures, vos paiements et vos relances dans une plateforme pensée pour les équipes B2B et la gestion d’entreprise.")}
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
                  {t("Créer un compte entreprise")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/15"
                >
                  {t("Accéder à mon espace")}
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
                <p className="text-3xl font-semibold text-white">150+</p>
                <p className="mt-2 text-sm text-slate-300">{t("Entreprises gérées")}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <p className="text-3xl font-semibold text-white">8K+</p>
                <p className="mt-2 text-sm text-slate-300">{t("Factures générées")}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/10 p-5">
                <p className="text-3xl font-semibold text-white">97%</p>
                <p className="mt-2 text-sm text-slate-300">{t("Taux de suivi paiements")}</p>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[1.65rem] border border-white/35 bg-gradient-to-br from-white/15 via-white/5 to-white/10 p-1.5 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.8)] ring-1 ring-white/10 backdrop-blur-xl">
              <video
                ref={demoVideoRef}
                className="aspect-video w-full rounded-[1.2rem] bg-slate-950 object-contain"
                autoPlay
                controls
                loop
                muted
                playsInline
                preload={shouldLoadDemoVideo ? "metadata" : "none"}
                poster={shouldLoadDemoVideo ? "/images/preuve.jpg" : undefined}
                aria-label={t("Démonstration de Simplifact")}
              >
                {shouldLoadDemoVideo && <source src="/videos/demo-simplifact.mp4" type="video/mp4" />}
                Votre navigateur ne prend pas en charge la lecture vidéo.
              </video>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== DASHBOARD CAPTURE ========== */}
      <section className="mx-auto max-w-6xl px-6 py-24 sm:px-10">
        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-[0_30px_70px_-40px_rgba(15,23,42,0.2)] overflow-hidden">
          <div className="bg-slate-950 px-6 py-6 text-white sm:px-10">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{t("Capture du dashboard")}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {t("Ce que voit vraiment l’utilisateur après connexion")}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
              {t("Un aperçu visuel du tableau de bord aide à rassurer : suivi des factures, clients actifs et factures en attente.")}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8">
            <div className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 bg-slate-950 px-5 py-4 text-sm text-slate-100">
                {t("Tableau de bord Simplifact")}
              </div>

              <img
                src="/images/cap.png"
                alt={t("Capture d'écran du tableau de bord Simplifact")}
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
            {t("Ce dont votre entreprise a vraiment besoin")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
          >
            {t("Gérez votre facturation comme un pro, sans complexité.")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-5 text-sm leading-7 text-slate-600 sm:text-base"
          >
            {t("Des fonctionnalités claires, un tableau de bord lisible et des factures prêtes à envoyer en quelques clics.")}
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
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.18)] transition hover:-translate-y-1 hover:shadow-[0_28px_70px_-30px_rgba(43,58,103,0.3)]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(201,162,39,0.12),_transparent_35%)] opacity-0 transition duration-500 group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#E9F4FF] text-[#2B3A67] shadow-sm ring-1 ring-[#dfe7ff]">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-slate-900">
                    {t(feature.title)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {t(feature.description)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="bg-transparent px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
            <div className="h-px bg-slate-200/80" />
            <p className="text-center text-sm uppercase tracking-[0.35em] text-slate-500">
              {t("Ils nous font confiance")}
            </p>
            <div className="h-px bg-slate-200/80" />
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-2xl font-semibold text-slate-900">120+</p>
              <p className="mt-2 text-sm text-slate-500">{t("entreprises accompagnées")}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-2xl font-semibold text-slate-900">3 000+</p>
              <p className="mt-2 text-sm text-slate-500">{t("factures créées")}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-2xl font-semibold text-slate-900">96%</p>
              <p className="mt-2 text-sm text-slate-500">{t("clients satisfaits")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== POUR QUI ========== */}
      <section className="bg-transparent px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              {t("Pour qui")}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {t("Conçu pour les PME, les agences et les équipes de gestion d’entreprise.")}
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
                <h3 className="text-xl font-semibold text-slate-900">{t(item.title)}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {t(item.text)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== COMMENT ÇA MARCHE ========== */}
      <section id="comment-ca-marche" className="bg-transparent px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              {t("Comment ça marche")}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {t("Trois étapes simples pour mettre votre facturation sous contrôle.")}
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
                    {t(step.title)}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {t(step.description)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== AVANT / APRÈS ========== */}
      <section className="bg-transparent px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
              {t("Avant / Après")}
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              {t("Passez d’un suivi manuel à une gestion structurée et professionnelle.")}
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
              <h3 className="font-semibold text-red-700">{t("Sans outil dédié")}</h3>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
                <li className="flex gap-3">
                  <span className="mt-1 text-red-500">✕</span>
                  {t("Factures faites à la main, modèles dispersés et erreurs fréquentes.")}
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 text-red-500">✕</span>
                  {t("Calculs manuels de TVA et suivi des paiements impossible.")}
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 text-red-500">✕</span>
                  {t("Relances improvisées et historique client incomplet.")}
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
              <h3 className="font-semibold text-slate-900">{t("Avec Simplifact")}</h3>
              <ul className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#C9A227]" />
                  {t("Factures prêtes en quelques clics, avec toutes les mentions légales.")}
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#C9A227]" />
                  {t("TVA automatique et suivi de paiement intégré.")}
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#C9A227]" />
                  {t("Clients centralisés, relances plus simples et reporting clair.")}
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
            {t("Ils facturent déjà avec nous")}
          </motion.h2>

          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
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
                  « {t(testimonial.text)} »
                </p>

                <div className="mt-5">
                  <p className="font-medium text-slate-800">{testimonial.name}</p>
                  <p className="text-xs text-slate-500">{t(testimonial.role)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ ========== */}
      <section id="faq" className="border-t border-slate-200 bg-transparent px-6 py-20">
        <div className="mx-auto max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-3xl font-semibold tracking-tight text-slate-900"
          >
            {t("Questions fréquentes")}
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
            {t("Prêt à moderniser la gestion de votre facturation ?")}
          </h2>
          <p className="mt-3 text-slate-600">
            {t("Créez votre compte entreprise et centralisez vos opérations commerciales en quelques minutes.")}
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="mt-6 bg-[#2B3A67] text-white shadow-lg shadow-[#2B3A67]/20 hover:bg-[#1f2a4d]"
            >
              {t("Créer un compte entreprise")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-12 text-slate-300">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(12rem,0.7fr)_minmax(0,1.3fr)] md:gap-16">
          <nav aria-label={t("Liens du site")} className="flex flex-col items-start gap-3 text-sm text-slate-400">
            <Link href="/login" className="transition hover:text-white">{t("Connexion")}</Link>
            <Link href="/register" className="transition hover:text-white">{t("Inscription")}</Link>
            <a href="#features" className="transition hover:text-white">{t("Fonctionnalités")}</a>
            <a href="#faq" className="transition hover:text-white">FAQ</a>
            <Link href="/about" className="transition hover:text-white">{t("À propos de nous")}</Link>
            <Link href="/privacy" className="transition hover:text-white">{t("Confidentialité")}</Link>
            <Link href="/terms" className="transition hover:text-white">{t("Conditions d’utilisation")}</Link>
          </nav>

          <div className="md:justify-self-end md:text-right">
            <p className="text-lg font-semibold text-white">Simplifact</p>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-400 md:ml-auto">
              {t("Une plateforme de gestion commerciale pensée pour les entreprises qui veulent contrôler leur facturation, leurs clients et leur trésorerie.")}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-800 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Simplifact. {t("Tous droits réservés.")}
        </div>
      </footer>
    </div>
  );
}