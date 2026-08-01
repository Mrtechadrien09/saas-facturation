"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { Loader2 } from "lucide-react";

export const dynamic = "force-dynamic";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, init } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    init();
    setChecking(false);
  }, [init]);

  useEffect(() => {
    if (!checking && !isAuthenticated) {
      router.push("/");
    }
  }, [checking, isAuthenticated, router]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

 if (!isAuthenticated) return null;



    

return (
  <div className="relative flex min-h-screen overflow-hidden bg-slate-50/50">
    {/* Dégradé discret en fond, option 2 */}
    <div
      className="pointer-events-none absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full opacity-[0.100] blur-3xl"
      style={{ background: "radial-gradient(circle, #2B3A67, transparent 70%)" }}
    />
    <div
      className="pointer-events-none absolute -bottom-40 -left-32 -z-10 h-96 w-96 rounded-full opacity-[0.03] blur-3xl"
      style={{ background: "radial-gradient(circle, #C9A227, transparent 70%)" }}
    />

    <Sidebar />
    <div className="flex flex-1 flex-col">
      {/* Bandeau accent, option 3 */}
      <div className="h-1 w-full bg-gradient-to-r from-[#2B3A67] to-[#C9A227]" />
      <Header />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mx-auto w-full max-w-7xl">{children}</div>
      </main>
    </div>
  </div>
 );
}