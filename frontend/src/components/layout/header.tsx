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
        <DropdownMenuTrigger
          render={
            <button className="flex items-center gap-3 rounded-full text-sm text-muted-foreground hover:text-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {user?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              {user?.name || user?.email}
            </button>
          }
        />
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
            Déconnexion
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}