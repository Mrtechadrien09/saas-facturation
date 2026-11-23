"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useLanguage } from "@/lib/language";

interface PublicInfoSection {
  title: string;
  paragraphs: string[];
}

interface PublicInfoPageProps {
  title: string;
  intro: string;
  sections: PublicInfoSection[];
  notice?: string;
}

export function PublicInfoPage({ title, intro, sections, notice }: PublicInfoPageProps) {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-[#EEF4F0] text-slate-800">
      <header className="flex items-center justify-between border-b border-slate-200/80 bg-white/90 px-5 py-4 backdrop-blur-md sm:px-10">
        <Link href="/" className="font-semibold text-[#2B3A67]">Simplifact</Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="hidden items-center gap-2 text-sm text-slate-600 hover:text-slate-950 sm:inline-flex">
            <ArrowLeft className="h-4 w-4" />
            {t("Accueil")}
          </Link>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-14 sm:px-10 sm:py-20">
        <div className="border-b border-slate-300/80 pb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#2B3A67]">Simplifact</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{t(title)}</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{t(intro)}</p>
        </div>

        {notice && (
          <aside className="mt-8 border-l-4 border-[#C9A227] bg-white/70 px-4 py-3 text-sm leading-6 text-slate-700" role="note">
            {t(notice)}
          </aside>
        )}

        <div className="divide-y divide-slate-300/70">
          {sections.map((section) => (
            <section key={section.title} className="py-8">
              <h2 className="text-xl font-semibold text-slate-900">{t(section.title)}</h2>
              <div className="mt-3 space-y-3 text-sm leading-7 text-slate-600 sm:text-base">
                {section.paragraphs.map((paragraph) => <p key={paragraph}>{t(paragraph)}</p>)}
              </div>
            </section>
          ))}
        </div>
      </main>

      <footer className="border-t border-slate-900 bg-slate-950 px-5 py-8 text-slate-300 sm:px-10">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-4 text-sm">
          <Link href="/" className="font-semibold text-white">Simplifact</Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/about" className="hover:text-white">{t("À propos de nous")}</Link>
            <Link href="/privacy" className="hover:text-white">{t("Confidentialité")}</Link>
            <Link href="/terms" className="hover:text-white">{t("Conditions d’utilisation")}</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}