"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Mail, Phone, Trash2, Loader2, Users, Search, ArrowUpDown, LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCustomers, useCreateCustomer, useDeleteCustomer } from "@/hooks/use-customers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ReactCountryFlag from "react-country-flag";
import { countries, normalizePhone, formatPhoneForDialCode } from "@/lib/countries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const avatarColors = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-violet-100 text-violet-700",
  "bg-amber-100 text-amber-700",
  "bg-rose-100 text-rose-700",
  "bg-cyan-100 text-cyan-700",
];

function getAvatarColor(name: string) {
  const index = name.charCodeAt(0) % avatarColors.length;
  return avatarColors[index];
}

export default function CustomersPage() {
  const { data: customers, isLoading } = useCustomers();
  const createCustomer = useCreateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    dialCode: "+33",
    phone: "",
    address: { street: "", city: "", zipCode: "", country: "France" },
  });
  const [validationErrors, setValidationErrors] = useState<{ field: string; message: string }[]>([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "recent">("name");
  const [view, setView] = useState<"cards" | "list">("cards");

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
  const selectedCountry = countries.find((country) => country.name === form.address.country) || countries.find((country) => country.name === "France");

  const handleCreate = async () => {
    const { dialCode, ...payloadBase } = form;
    const cleanAddress = Object.fromEntries(
      Object.entries(form.address).filter(([_, value]) => typeof value === "string" ? value.trim() !== "" : value)
    );

    const payload = {
      ...payloadBase,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone ? normalizePhone(form.phone, form.dialCode) : "",
      ...(Object.keys(cleanAddress).length > 0 ? { address: cleanAddress } : {}),
    };

    setValidationErrors([]);

    try {
      await createCustomer.mutateAsync(payload);
      setForm({ name: "", email: "", dialCode: "+33", phone: "", address: { street: "", city: "", zipCode: "", country: "France" } });
      setValidationErrors([]);
      setOpen(false);
    } catch (error: any) {
      const backendErrors = Array.isArray(error?.response?.data?.errors)
        ? error.response.data.errors
        : [{ field: "general", message: error?.response?.data?.message || "Erreur lors de la création du client." }];
      setValidationErrors(backendErrors);
    }
  };

  const filteredCustomers = customers
    ?.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.18)]">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Clients</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Gérez votre portefeuille clients</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Retrouvez rapidement un client, ajoutez ses détails et créez une facture en quelques clics.
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <Button size="lg" className="gap-2">
                  <Plus className="mr-2 h-4 w-4" />
                  Nouveau client
                </Button>
              }
            />
            <DialogContent className="w-full max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter un client</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                {validationErrors.length > 0 && (
                  <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    <p className="font-medium">Vérifiez les informations :</p>
                    <ul className="mt-2 list-disc space-y-1 pl-5">
                      {validationErrors.map((error, index) => (
                        <li key={`${error.field}-${index}`}>
                          {error.field !== "general" ? `${error.field}: ` : ""}
                          {error.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => {
                      setForm({ ...form, name: e.target.value });
                      if (validationErrors.length > 0) setValidationErrors([]);
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-[110px_1fr]">
                  <div className="space-y-2">
                    <Label htmlFor="dialCode">Indicatif</Label>
                    <Select
                      value={form.dialCode || "+33"}
                      onValueChange={handleDialCodeChange}
                    >
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          {selectedDialCountry && (
                            <ReactCountryFlag countryCode={selectedDialCountry.code} svg className="text-lg leading-none" />
                          )}
                          <span>{form.dialCode || "+33"}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.dialCode}>
                            <span className="mr-2 inline-flex items-center">
                              <ReactCountryFlag countryCode={country.code} svg className="text-lg leading-none" />
                            </span>
                            <span>{country.dialCode}</span>
                            <span className="ml-2 text-slate-500">{country.code}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      placeholder="6 12 34 56 78"
                      onChange={(e) => handlePhoneChange(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">Rue</Label>
                  <Input
                    id="street"
                    value={form.address.street}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={form.address.city}
                      onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">Code postal</Label>
                    <Input
                      id="zipCode"
                      value={form.address.zipCode}
                      onChange={(e) => setForm({ ...form, address: { ...form.address, zipCode: e.target.value } })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Pays</Label>
                  <Select
                    value={form.address.country || "France"}
                    onValueChange={(value: string | null) => setForm({ ...form, address: { ...form.address, country: value || "France" } })}
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center gap-2">
                        {selectedCountry && (
                          <ReactCountryFlag countryCode={selectedCountry.code} svg className="text-lg leading-none" />
                        )}
                        <span>{form.address.country || "France"}</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          <span className="mr-2 inline-flex items-center">
                            <ReactCountryFlag countryCode={country.code} svg className="text-lg leading-none" />
                          </span>
                          <span>{country.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleCreate}
                  disabled={createCustomer.isPending || !form.name || !form.email}
                  className="w-full"
                >
                  {createCustomer.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Créer"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

<div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] xl:grid-cols-[minmax(0,1fr)_auto_auto] xl:items-end">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Rechercher un client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={sortBy} onValueChange={(v) => v && setSortBy(v as "name" | "recent")}> 
            <SelectTrigger className="w-44">
              <ArrowUpDown className="mr-2 h-3.5 w-3.5" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nom (A-Z)</SelectItem>
              <SelectItem value="recent">Plus récents</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            <button
              onClick={() => setView("cards")}
              className={`rounded-xl p-2 transition-colors ${view === "cards" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-xl p-2 transition-colors ${view === "list" ? "bg-slate-950 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {isLoading && view === "cards" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="space-y-2 p-4">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && filteredCustomers?.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center"
        >
          <Users className="h-10 w-10 text-muted-foreground/50" />
          <h3 className="mt-4 font-medium">Aucun client pour le moment</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Ajoutez votre premier client pour commencer la facturation.
          </p>
        </motion.div>
      )}

      {!isLoading && view === "cards" && filteredCustomers && filteredCustomers.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCustomers.map((customer, i) => (
            <motion.div
              key={customer._id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
            >
              <Card className="group relative">
                <CardContent className="p-4">
                  <Link href={`/customers/${customer._id}`} className="block">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-medium ${getAvatarColor(
                          customer.name
                        )}`}
                      >
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="font-medium">{customer.name}</h3>
                    </div>
                    <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        <span className="leading-none">{customer.email}</span>
                      </div>
                      {customer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 shrink-0" />
                          <span className="leading-none">{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => deleteCustomer.mutate(customer._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && view === "list" && filteredCustomers && filteredCustomers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="rounded-lg border"
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead className="w-10"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer._id} className="cursor-pointer hover:bg-muted/50">
  <TableCell className="py-3">
    <Link href={`/customers/${customer._id}`} className="flex items-center gap-2 font-medium">
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium ${getAvatarColor(
          customer.name
        )}`}
      >
        {customer.name.charAt(0).toUpperCase()}
      </div>
      {customer.name}
    </Link>
  </TableCell>
  <TableCell className="py-3">
    <Link href={`/customers/${customer._id}`} className="block text-muted-foreground">
      {customer.email}
    </Link>
  </TableCell>
  <TableCell className="py-3">
    <Link href={`/customers/${customer._id}`} className="block text-muted-foreground">
      {customer.phone || "—"}
    </Link>
  </TableCell>
  <TableCell className="py-3">
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation();
        deleteCustomer.mutate(customer._id);
      }}
    >
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  </TableCell>
</TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </div>
  );
}