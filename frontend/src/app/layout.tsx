import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Simplifact",
  description: "Gestion des factures avec Simplifact",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors/>
        <Script 
          src="https://jsdelivr.net" 
          strategy="beforeInteractive" // <-- Force le chargement au plus tôt
        />
        <Script id="eruda-init" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined') {
              var interval = setInterval(function() {
                if (window.eruda) {
                  window.eruda.init();
                  clearInterval(interval);
                }
              }, 100);
            }
          `}
        </Script>
      </body>
    </html>
  );
}