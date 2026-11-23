"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Phone, MapPin, FileText, Loader2, Pencil, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCustomer, useUpdateCustomer } from "@/hooks/use-customers";
import { useCustomerInvoices } from "@/hooks/use-invoices";
import { formatCurrency } from "@/lib/utils";
import ReactCountryFlag from "react-country-flag";
import {
  countries,
  normalizePhone,
  getCountryByName,
  getDialCodeFromPhone,
  stripDialCode,
  formatPhoneForDialCode,
} from "@/lib/countries";
import Link from "next/link";
import { useLanguage } from "@/lib/language";

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  SENT: "Envoyée",
  PAID: "Payée",
  OVERDUE: "En retard",
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  SENT: "outline",
  PAID: "default",
  OVERDUE: "destructive",
};

export default function CustomerDetailPage() {
  const { language, t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: customer, isLoading } = useCustomer(id);
  const { data: invoices, isLoading: invoicesLoading } = useCustomerInvoices(id);
  const updateCustomer = useUpdateCustomer();

  const [editOpen, setEditOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ field: string; message: string }[]>([]);
  const [form, setForm] = useState({ name: "", email: "", dialCode: "+33", phone: "", address:{street: "", city: "", zipCode: "", country: "France"}, });

  const handleDialCodeChange = (value: string | null, _eventDetails?: unknown) => {
    const nextDialCode = value || "+33";
    setForm((prev) => ({
      ...prev,
      dialCode: nextDialCode,
      phone: formatPhoneForDialCode(prev.phone, nextDialCode),
    }));
  };

  const handlePhoneChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      phone: formatPhoneForDialCode(value, prev.dialCode),
    }));
  };

  const selectedDialCountry = countries.find((country) => country.dialCode === form.dialCode) || countries.find((country) => country.dialCode === "+33");
  const englishCountryNames = new Intl.DisplayNames(["en"], { type: "region" });
  const getCountryLabel = (country: (typeof countries)[number]) =>
    language === "en" ? englishCountryNames.of(country.code) || country.name : country.name;
  const countriesSortedByName = [...countries].sort((a, b) =>
    getCountryLabel(a).localeCompare(getCountryLabel(b), language === "en" ? "en" : "fr-FR")
  );
  const selectedCountry = countries.find((country) => country.name === form.address.country) || countries.find((country) => country.name === "France");

  const openEdit = () => {
    if (customer) {
      const dialCode = getDialCodeFromPhone(customer.phone || "") || "+33";
      setForm({
        name: customer.name,
        email: customer.email,
        dialCode,
        phone: stripDialCode(customer.phone || ""),
        address: {
          street: customer.address?.street || "",
          city: customer.address?.city || "",
          zipCode: customer.address?.zipCode || "",
          country: customer.address?.country || "France",
        },
      });
      setEditOpen(true);
    }
  };

  const handleUpdate = async () => {
    setValidationErrors([]);

    try {
      await updateCustomer.mutateAsync({
        id,
        payload: {
          ...form,
          phone: form.phone ? normalizePhone(form.phone, form.dialCode) : "",
        },
      });
      setValidationErrors([]);
      setEditOpen(false);
    } catch (error: any) {
      const backendErrors = Array.isArray(error?.response?.data?.errors)
        ? error.response.data.errors
        : [{ field: "general", message: error?.response?.data?.message || "Erreur lors de la modification du client." }];
      setValidationErrors(backendErrors.map((item: { field: string; message: string }) => ({
        ...item,
        message: t(item.message),
      })));
    }
  };

  if (isLoading) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-56" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}

  if (!customer) {
    return <p className="text-muted-foreground">{t("Client introuvable.")}</p>;
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push("/customers")} className="text-slate-600 hover:bg-slate-100 hover:text-slate-900">
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("Retour aux clients")}
      </Button>

      <div className="rounded-[28px] border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-[#edf3ff] p-5 shadow-[0_25px_70px_-35px_rgba(15,23,42,0.5)] sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#2B3A67] text-xl font-semibold text-white shadow-lg shadow-[#2B3A67]/20">
              {customer.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">{customer.name}</h1>
              <div className="mt-2 space-y-1.5 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-500" />
                  {customer.email}
                </div>
                {customer.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-500" />
                    {customer.phone}
                  </div>
                )}
                {customer.address?.city && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-slate-500" />
                    {[customer.address.street, customer.address.city, customer.address.zipCode, customer.address.country]
                      .filter(Boolean)
                      .join(", ")}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link href={`/invoices/new?customerId=${customer._id}`}>
              <Button className="bg-[#2B3A67] hover:bg-[#1f2b4d]">
                <FilePlus className="mr-2 h-4 w-4" />
                {t("Nouvelle facture")}
              </Button>
            </Link>
            <Button variant="outline" onClick={openEdit} className="border-slate-200 bg-white hover:bg-slate-50">
              <Pencil className="mr-2 h-4 w-4" />
              {t("Modifier")}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 bg-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.6)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">{t("Total payé")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">
              {formatCurrency(invoices?.reduce((sum, invoice) => sum + (invoice.status === "PAID" ? invoice.total : 0), 0) ?? 0, language)}
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.6)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">{t("Factures")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">{invoices?.length ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.6)]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-500">{t("En attente")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">
              {invoices?.filter((invoice) => invoice.status === "SENT" || invoice.status === "OVERDUE").length ?? 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">{t("Factures")}</h2>

        {invoicesLoading && <p className="text-muted-foreground">{t("Chargement…")}</p>}

        {!invoicesLoading && invoices?.length === 0 && (
          <p className="text-muted-foreground">{t("Aucune facture pour ce client.")}</p>
        )}

        <div className="space-y-3">
          {invoices?.map((invoice, i) => (
            <motion.div
              key={invoice._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <Link href={`/invoices/${invoice._id}`}>
                <Card className="border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:bg-slate-50">
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ff] text-[#2B3A67]">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-slate-500">{invoice.issueDate ? new Date(invoice.issueDate).toLocaleDateString(language === "en" ? "en-GB" : "fr-FR") : t("Date inconnue")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-700">
                        {formatCurrency(invoice.total, language)}
                      </span>
                      <Badge variant={statusVariants[invoice.status]}>
                        {t(statusLabels[invoice.status])}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("Modifier le client")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            {validationErrors.length > 0 && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                <p className="font-medium">{t("Vérifiez les informations :")}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  {validationErrors.map((error, index) => (
                    <li key={`${error.field}-${index}`}>
                      {error.field !== "general" ? `${t(error.field)}: ` : ""}
                      {t(error.message)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t("Nom")}</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">{t("Email")}</Label>
              <Input
                id="edit-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-[110px_1fr]">
              <div className="space-y-2">
                <Label htmlFor="edit-dialCode">{t("Indicatif")}</Label>
                <Select value={form.dialCode} onValueChange={handleDialCodeChange}>
                  <SelectTrigger className="w-full">
                    <div className="flex items-center gap-2">
                      {selectedDialCountry && (
                        <ReactCountryFlag countryCode={selectedDialCountry.code} svg className="text-lg leading-none" />
                      )}
                      <span>{form.dialCode}</span>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {countriesSortedByName.map((country) => (
                      <SelectItem key={country.code} value={country.dialCode}>
                        <span className="mr-2 inline-flex items-center">
                          <ReactCountryFlag countryCode={country.code} svg className="text-lg leading-none" />
                        </span>
                        <span>{country.dialCode}</span>
                        <span className="ml-2 text-slate-500">{getCountryLabel(country)}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">{t("Téléphone")}</Label>
                <Input
                  id="edit-phone"
                  value={form.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-street">{t("Rue")}</Label>
              <Input
                id="edit-street"
                value={form.address.street}
                onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-city">{t("Ville")}</Label>
                <Input
                  id="edit-city"
                  value={form.address.city}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-zipCode">{t("Code postal")}</Label>
                <Input
                  id="edit-zipCode"
                  value={form.address.zipCode}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, zipCode: e.target.value } })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-country">{t("Pays")}</Label>
              <Select
                value={form.address.country}
                onValueChange={(value: string | null) => setForm({ ...form, address: { ...form.address, country: value || "France" } })}
              >
                <SelectTrigger className="w-full">
                  <div className="flex items-center gap-2">
                    {selectedCountry && (
                      <ReactCountryFlag countryCode={selectedCountry.code} svg className="text-lg leading-none" />
                    )}
                    <span>{selectedCountry ? getCountryLabel(selectedCountry) : t("Pays")}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {countriesSortedByName.map((country) => (
                    <SelectItem key={country.code} value={country.name}>
                      <span className="mr-2 inline-flex items-center">
                        <ReactCountryFlag countryCode={country.code} svg className="text-lg leading-none" />
                      </span>
                      <span>{getCountryLabel(country)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleUpdate} disabled={updateCustomer.isPending} className="w-full">
              {updateCustomer.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t("Enregistrer")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}