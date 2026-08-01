"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings, useUpdateSettings } from "@/hooks/use-settings";
import { Settings } from "@/types/settings.js";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { countries } from "@/lib/countries";

const defaultSettings: Settings = {
  companyInfo: { name: "", siret: "", phone: "", email: "", website: "" },
  address: { street: "", city: "", zipCode: "", country: "France" },
  financials: { currency: "EUR", defaultVatRate: 20 },
};

export default function SettingsPage() {
  const { data, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState<Settings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
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
      <div>
        <h1 className="text-2xl font-semibold">Paramètres</h1>
        <p className="text-muted-foreground">Informations de ton entreprise</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Entreprise</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Raison sociale *</Label>
              <Input
                id="name"
                value={form.companyInfo.name}
                onChange={(e) =>
                  setForm({ ...form, companyInfo: { ...form.companyInfo, name: e.target.value } })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="siret">SIRET</Label>
              <Input
                id="siret"
                value={form.companyInfo.siret || ""}
                onChange={(e) =>
                  setForm({ ...form, companyInfo: { ...form.companyInfo, siret: e.target.value } })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyEmail">Email</Label>
              <Input
                id="companyEmail"
                type="email"
                value={form.companyInfo.email || ""}
                onChange={(e) =>
                  setForm({ ...form, companyInfo: { ...form.companyInfo, email: e.target.value } })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={form.companyInfo.phone || ""}
                onChange={(e) =>
                  setForm({ ...form, companyInfo: { ...form.companyInfo, phone: e.target.value } })
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                value={form.companyInfo.website || ""}
                onChange={(e) =>
                  setForm({ ...form, companyInfo: { ...form.companyInfo, website: e.target.value } })
                }
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Adresse</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="street">Rue</Label>
              <Input
                id="street"
                value={form.address.street || ""}
                onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={form.address.city || ""}
                onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Code postal</Label>
              <Input
                id="zipCode"
                value={form.address.zipCode || ""}
                onChange={(e) => setForm({ ...form, address: { ...form.address, zipCode: e.target.value } })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Pays</Label>
              <Select
                value={form.address.country || "France"}
                onValueChange={(value) => setForm({ ...form, address: { ...form.address, country: value } })}
              >
                <SelectTrigger className="w-full">
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
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Facturation</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Input
                id="currency"
                value={form.financials.currency}
                onChange={(e) =>
                  setForm({ ...form, financials: { ...form.financials, currency: e.target.value } })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vatRate">Taux de TVA par défaut (%)</Label>
              <Input
                id="vatRate"
                type="number"
                value={form.financials.defaultVatRate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    financials: { ...form.financials, defaultVatRate: Number(e.target.value) },
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} disabled={updateSettings.isPending || !form.companyInfo.name}>
          {updateSettings.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Enregistrer
        </Button>

        {saved && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-sm text-green-600"
          >
            <CheckCircle2 className="h-4 w-4" />
            Enregistré
          </motion.div>
        )}
      </div>
    </div>
  );
}