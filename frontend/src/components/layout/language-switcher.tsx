"use client";

import { useLanguage } from "@/lib/language";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      aria-label="Language"
      className="inline-flex items-center gap-0.5 rounded-lg border border-slate-200 bg-white p-0.5 text-xs font-semibold shadow-sm"
    >
      {(["fr", "en"] as const).map((option) => (
        <button
          key={option}
          type="button"
          aria-pressed={language === option}
          onClick={() => setLanguage(option)}
          className={[
            "rounded-md px-2 py-1 transition-colors",
            language === option ? "bg-[#2B3A67] text-white" : "text-slate-600 hover:bg-slate-100",
          ].join(" ")}
        >
          {option.toUpperCase()}
        </button>
      ))}
    </div>
  );
}