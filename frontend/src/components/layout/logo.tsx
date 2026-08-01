import React from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-base font-bold text-white">
        S
      </span>
      <span className="font-semibold tracking-tight text-slate-900">Simplifact</span>
    </div>
  );
}
