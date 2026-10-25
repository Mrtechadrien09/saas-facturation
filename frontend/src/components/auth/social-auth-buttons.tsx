"use client";

import type { ReactNode } from "react";

export type SocialProvider = "google" | "github";

interface SocialAuthButtonsProps {
  className?: string;
  onSelect?: (provider: SocialProvider) => void;
}

const providers: { id: SocialProvider; label: string; icon: ReactNode }[] = [
  {
    id: "google",
    label: "Google",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4">
        <path fill="#EA4335" d="M12 10.2v3.9h5.4c-.2 1.3-1.4 3.9-5.4 3.9-3.3 0-6-2.7-6-6s2.7-6 6-6c1.9 0 3.2.8 4 1.5l2.7-2.6C16.8 3.3 14.7 2.4 12 2.4 6.9 2.4 2.7 6.6 2.7 11.7S6.9 21 12 21c6.9 0 11.4-4.8 11.4-11.6 0-.8-.1-1.4-.2-2H12z" />
        <path fill="#34A853" d="M3.9 7.4l3.4 2.5c.9-1.8 2.8-3.3 4.7-3.3 1.9 0 3.2.8 4 1.5l2.7-2.6C16.8 3.3 14.7 2.4 12 2.4 8.4 2.4 5.3 4.7 3.9 7.4z" opacity=".9" />
        <path fill="#FBBC05" d="M3.9 16c1.5 2.8 4.6 4.8 8.1 4.8 2.5 0 4.6-.9 6.1-2.5l-2.8-2.2c-.8.6-1.9 1-3.3 1-2.5 0-4.6-1.6-5.3-3.8L3.9 16z" opacity=".9" />
        <path fill="#4285F4" d="M12 21c2.6 0 4.9-.8 6.5-2.2l-3.1-2.5c-.8.6-2 .9-3.4.9-2.5 0-4.6-1.7-5.3-3.9L1.8 10c1.3 3.8 4.9 6.4 10.2 6.4z" opacity=".9" />
      </svg>
    ),
  },
  {
    id: "github",
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
        <path d="M12 .5C5.6.5.5 5.6.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1 1.7 1 .2 1.6.8.8 2.2.8 2.2.8.9 0 1.8-.3 2.2-.7.2-1.2.7-2 .8-2.2-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.4-2.3 1.2-3.2-.1-.3-.5-1.4.1-3.1 0 0 1-.3 3.3 1.2a11.2 11.2 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.7.6 1.2 1.8 1.2 3.5v2.5c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12C23.5 5.6 18.4.5 12 .5Z" />
      </svg>
    ),
  },
];

export function SocialAuthButtons({ className = "", onSelect }: SocialAuthButtonsProps) {
  const handleSelect = (provider: SocialProvider) => {
    if (onSelect) {
      onSelect(provider);
      return;
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://saas-facturation-backend-hb6b.onrender.com/api";
    window.location.href = `${apiBaseUrl}/auth/${provider}`;
  };

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`.trim()}>
      {providers.map((provider) => (
        <button
          key={provider.id}
          type="button"
          onClick={() => handleSelect(provider.id)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          {provider.icon}
          {provider.label}
        </button>
      ))}
    </div>
  );
}
