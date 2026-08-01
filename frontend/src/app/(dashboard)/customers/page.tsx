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
import { countries, normalizePhone } from "@/lib/countries";
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
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "recent">("name");
  const [view, setView] = useState<"cards" | "list">("cards");

  const handleCreate = async () => {
    const { dialCode, ...payloadBase } = form;
    const payload = {
      ...payloadBase,
      phone: form.phone ? normalizePhone(form.phone, form.dialCode) : "",
    };

    await createCustomer.mutateAsync(payload);
    setForm({ name: "", email: "", dialCode: "+33", phone: "", address: { street: "", city: "", zipCode: "", country: "France" } });
    setOpen(false);
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
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Gère ta liste de clients</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Retrouve rapidement un client, ajoute ses détails et crée une facture en quelques clics.
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
                <div className="space-y-2">
                  <Label htmlFor="name">Nom</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      placeholder="612345678"
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
            Ajoute ton premier client pour commencer à facturer.
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