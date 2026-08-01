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
import { countries, normalizePhone, getCountryByName, getDialCodeFromPhone, stripDialCode } from "@/lib/countries";
import Link from "next/link";

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
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: customer, isLoading } = useCustomer(id);
  const { data: invoices, isLoading: invoicesLoading } = useCustomerInvoices(id);
  const updateCustomer = useUpdateCustomer();

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", dialCode: "+33", phone: "", address:{street: "", city: "", zipCode: "", country: "France"}, });

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
    await updateCustomer.mutateAsync({
      id,
      payload: {
        ...form,
        phone: form.phone ? normalizePhone(form.phone, form.dialCode) : "",
      },
    });
    setEditOpen(false);
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
    return <p className="text-muted-foreground">Client introuvable.</p>;
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push("/customers")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux clients
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{customer.name}</h1>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" />
              {customer.email}
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                {customer.phone}
              </div>
            )}
            {customer.address?.city && (
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5" />
                {[customer.address.street, customer.address.city, customer.address.zipCode, customer.address.country]
                  .filter(Boolean)
                  .join(", ")}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
  <Link href={`/invoices/new?customerId=${customer._id}`}>
    <Button>
      <FilePlus className="mr-2 h-4 w-4" />
      Nouvelle facture
    </Button>
  </Link>
  <Button variant="outline" onClick={openEdit}>
    <Pencil className="mr-2 h-4 w-4" />
    Modifier
  </Button>
</div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-medium">Factures</h2>

        {invoicesLoading && <p className="text-muted-foreground">Chargement…</p>}

        {!invoicesLoading && invoices?.length === 0 && (
          <p className="text-muted-foreground">Aucune facture pour ce client.</p>
        )}

        <div className="space-y-2">
          {invoices?.map((invoice, i) => (
            <motion.div
              key={invoice._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
            >
              <Link href={`/invoices/${invoice._id}`}>
                <Card className="transition-colors hover:bg-muted/50">
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{invoice.invoiceNumber}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(invoice.total)}
                      </span>
                      <Badge variant={statusVariants[invoice.status]}>
                        {statusLabels[invoice.status]}
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
            <DialogTitle>Modifier le client</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nom</Label>
              <Input
                id="edit-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-[110px_1fr]">
              <div className="space-y-2">
                <Label htmlFor="edit-dialCode">Indicatif</Label>
                <Select value={form.dialCode} onValueChange={(value) => setForm({ ...form, dialCode: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.dialCode}>
                        <span>{country.dialCode}</span>
                        <span className="text-slate-500">{country.code}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Téléphone</Label>
                <Input
                  id="edit-phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-street">Rue</Label>
              <Input
                id="edit-street"
                value={form.address.street}
                onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit-city">Ville</Label>
                <Input
                  id="edit-city"
                  value={form.address.city}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-zipCode">Code postal</Label>
                <Input
                  id="edit-zipCode"
                  value={form.address.zipCode}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, zipCode: e.target.value } })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-country">Pays</Label>
              <Select
                value={form.address.country}
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
            <Button onClick={handleUpdate} disabled={updateCustomer.isPending} className="w-full">
              {updateCustomer.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}