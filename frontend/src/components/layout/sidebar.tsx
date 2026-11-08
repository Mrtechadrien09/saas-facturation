"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, FileText, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { Logo } from "@/components/layout/logo";

export const navItems = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/customers", label: "Clients", icon: Users },
  { href: "/invoices", label: "Factures", icon: FileText },
  { href: "/settings", label: "Paramètres", icon: Settings },
];
const iconColors: Record<string, string> = {
  "/dashboard": "text-blue-500",
  "/customers": "text-emerald-500",
  "/invoices": "text-violet-500",
  "/settings": "text-amber-500",
};



export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-sky-800/60 bg-[#0b1224] text-slate-100 shadow-[inset_-1px_0_0_rgba(96,165,250,0.2)] md:flex">
      <div className="flex h-16 items-center justify-center border-b border-sky-800/60 px-6">
        <Logo className="h-5 w-auto" />
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href} className="relative block">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <div
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive ? "text-white" : "text-slate-300 hover:bg-sky-950/60 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-white" : iconColors[item.href])} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sky-800/60 p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-medium text-white shadow-md shadow-blue-500/20 transition hover:bg-blue-500"
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}