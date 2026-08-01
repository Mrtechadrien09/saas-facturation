"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, FileText, Settings, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

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

  return (
    <aside className="hidden w-64 flex-col border-r bg-gradient-to-b from-blue-100/80 to-slate-100/50 md:flex">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <Receipt className="h-5 w-5 text-primary" />
        <span className="font-semibold">Simplifact</span>
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
                  className="absolute inset-0 rounded-md bg-white shadow-sm"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <div
                className={cn(
                  "relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-primary" : "text-slate-1000 hover:text-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive ? "text-primary" : iconColors[item.href])} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}