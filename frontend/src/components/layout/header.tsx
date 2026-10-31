"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navItems } from "@/components/layout/sidebar";
import { Menu } from "lucide-react";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const handleNavigation = (href: string) => {
    setMenuOpen(false);
    router.push(href);
  };

  return (
    <header className="relative flex h-16 items-center justify-between border-b px-6">
      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-semibold text-slate-900">Simplifact</span>
      </div>

      {menuOpen && (
        <div className="absolute left-4 top-20 z-40 w-56 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl md:hidden">
          <div className="flex flex-col p-2">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNavigation(item.href)}
                className={`rounded-2xl px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-slate-100 ${pathname === item.href ? "bg-slate-100 font-semibold" : ""}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-950">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2B3A67] text-sm font-medium text-white">
            {user?.name?.charAt(0).toUpperCase() || "?"}
          </div>
          <span className="max-w-[160px] truncate">{user?.name || user?.email}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}