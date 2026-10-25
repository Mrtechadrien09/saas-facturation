"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Loader2,
  Save,
  CheckCircle2,
  Building2,
  CreditCard,
  Shield,
  SunMedium,
  UploadCloud,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { Settings } from "@/types/settings.js";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from "@/lib/countries";

type SettingsTab = "company" | "payments" | "security";

const defaultSettings: Settings = {
  companyInfo: { name: "", siret: "", phone: "", email: "", website: "" },
  address: { street: "", city: "", zipCode: "", country: "France" },
  financials: { currency: "EUR", defaultVatRate: 20 },
};

const tabs: { id: SettingsTab; label: string; icon: typeof Building2 }[] = [
  { id: "company", label: "Entreprise & Logo", icon: Building2 },
  { id: "payments", label: "Méthodes de Paiement", icon: CreditCard },
  { id: "security", label: "Thème & Sécurité", icon: Shield },
];

export default function SettingsPage() {
  const { data, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState<Settings>(defaultSettings);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>("company");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        ...defaultSettings,
        ...data,
        companyInfo: { ...defaultSettings.companyInfo, ...(data.companyInfo ?? {}) },
        address: { ...defaultSettings.address, ...(data.address ?? {}) },
        financials: { ...defaultSettings.financials, ...(data.financials ?? {}) },
      });
    }
  }, [data]);

  const handleSave = async () => {
    setSaved(false);
    await updateSettings.mutateAsync(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-[#f4f7ff] p-5 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#dfe7ff] bg-[#edf3ff] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2B3A67]">
              <Sparkles className="h-3.5 w-3.5" />
              compte & entreprise
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">Paramètres</h1>
          </div>

          <Button onClick={handleSave} disabled={updateSettings.isPending || !form.companyInfo.name} className="bg-[#2B3A67] hover:bg-[#1f2b4d]">
            {updateSettings.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Enregistrer
          </Button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Profil</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">{form.companyInfo.name || "À compléter"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Paiements</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Stripe</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Sécurité</p>
            <p className="mt-2 text-xl font-semibold text-slate-900">Niveau élevé</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-[#2B3A67] text-white shadow-[0_12px_30px_-16px_rgba(43,58,103,0.85)]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === "company" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base text-slate-900">Profil de l’entreprise</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Raison sociale *</Label>
                  <Input
                    id="name"
                    value={form.companyInfo.name}
                    onChange={(e) => setForm({ ...form, companyInfo: { ...form.companyInfo, name: e.target.value } })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siret">SIRET</Label>
                  <Input
                    id="siret"
                    value={form.companyInfo.siret || ""}
                    onChange={(e) => setForm({ ...form, companyInfo: { ...form.companyInfo, siret: e.target.value } })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyEmail">Email</Label>
                  <Input
                    id="companyEmail"
                    type="email"
                    value={form.companyInfo.email || ""}
                    onChange={(e) => setForm({ ...form, companyInfo: { ...form.companyInfo, email: e.target.value } })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={form.companyInfo.phone || ""}
                    onChange={(e) => setForm({ ...form, companyInfo: { ...form.companyInfo, phone: e.target.value } })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={form.companyInfo.website || ""}
                    onChange={(e) => setForm({ ...form, companyInfo: { ...form.companyInfo, website: e.target.value } })}
                    className="h-11"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base text-slate-900">Adresse</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="street">Rue</Label>
                  <Input
                    id="street"
                    value={form.address.street || ""}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ville</Label>
                  <Input
                    id="city"
                    value={form.address.city || ""}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">Code postal</Label>
                  <Input
                    id="zipCode"
                    value={form.address.zipCode || ""}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, zipCode: e.target.value } })}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="country">Pays</Label>
                  <Select
                    value={form.address.country || "France"}
                    onValueChange={(value) => setForm({ ...form, address: { ...form.address, country: value } })}
                  >
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Sélectionne un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Logo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <div className="mb-4 rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-200">
                  <UploadCloud className="h-6 w-6 text-slate-600" />
                </div>
                <p className="text-base font-medium text-slate-800">Téléverse ton logo</p>
                <p className="mt-1 text-sm text-slate-500">PNG, JPG ou SVG • jusqu’à 2 Mo</p>
                <Button type="button" variant="outline" className="mt-5">
                  Choisir un fichier
                </Button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4">
                <p className="text-sm font-medium text-slate-700">Aperçu</p>
                <div className="mt-3 flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-200">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2B3A67] text-lg font-semibold text-white">
                    {form.companyInfo.name ? form.companyInfo.name.slice(0, 1).toUpperCase() : "S"}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{form.companyInfo.name || "Nom de votre entreprise"}</p>
                    <p className="text-xs text-slate-500">Identité visuelle</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "payments" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Paiements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex flex-col gap-3 rounded-[22px] border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-900">Stripe</p>
                  <p className="text-sm text-slate-500">Connecte ton compte pour accepter des paiements en ligne.</p>
                </div>
                <Button type="button" variant="outline" className="min-w-36 border-slate-300 bg-white hover:bg-slate-50">
                  Connecter
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stripePublicKey">Clé publique</Label>
                  <Input id="stripePublicKey" placeholder="pk_live_..." className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stripeSecretKey">Clé secrète</Label>
                  <Input id="stripeSecretKey" type="password" placeholder="sk_live_..." className="h-11" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-900">Mode de paiement</p>
                  <div className="inline-flex rounded-full bg-white p-1 ring-1 ring-slate-200">
                    <button type="button" className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white">
                      Test
                    </button>
                    <button type="button" className="rounded-full px-3 py-1.5 text-xs font-medium text-slate-600">
                      Live
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-500">Utilise les clés de test lors du développement puis bascule en production à la fin.</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {activeTab === "security" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Thème</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white p-2 ring-1 ring-slate-200">
                    <SunMedium className="h-4 w-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Mode sombre</p>
                    <p className="text-sm text-slate-500">Active le thème sombre pour le dashboard.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setDarkMode((value) => !value)}
                  className={[
                    "relative inline-flex h-7 w-12 items-center rounded-full transition-colors",
                    darkMode ? "bg-slate-900" : "bg-slate-200",
                  ].join(" ")}
                  aria-label="Activer le mode sombre"
                >
                  <span
                    className={[
                      "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
                      darkMode ? "translate-x-6" : "translate-x-1",
                    ].join(" ")}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-slate-900">Sécurité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                  <Input id="currentPassword" type="password" placeholder="••••••••" className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                  <Input id="newPassword" type="password" placeholder="••••••••" className="h-11" />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                <div>
                  <p className="font-medium text-slate-900">Authentification à deux facteurs</p>
                  <p className="text-sm text-slate-500">Renforce la sécurité du compte.</p>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Check className="h-4 w-4 text-emerald-500" />
                  Activer
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-5 right-5 z-20 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 shadow-lg"
        >
          <CheckCircle2 className="h-4 w-4" />
          Enregistré
        </motion.div>
      )}
    </div>
  );
}