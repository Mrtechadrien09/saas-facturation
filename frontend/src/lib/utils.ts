import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatCurrency(cents: number, language: "fr" | "en" = "fr"): string {
  return (cents / 100).toLocaleString(language === "en" ? "en-GB" : "fr-FR", {
    style: "currency",
    currency: "EUR",
  });
}