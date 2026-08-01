"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, FileText, Loader2, Search, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useInvoices } from "@/hooks/use-invoices";
import { useCustomers } from "@/hooks/use-customers";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Input} from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const statusBorderColors: Record<string, string> = {
  DRAFT: "border-l-slate-400",
  SENT: "border-l-blue-400",
  PAID: "border-l-emerald-500",
  OVERDUE: "border-l-red-500",
};

export default function InvoicesPage() {
  const [page, setPage] = useState(1);
  const { data: response, isLoading } = useInvoices(page, 10);
  const { data: customers } = useCustomers();

  const invoices = response?.data || [];
  const pagination = response?.pagination;

  const getCustomerName = (customerId: string) =>
    customers?.find((c) => c._id === customerId)?.name || "Client inconnu";

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");

  const filteredInvoices = invoices
    ?.filter((inv) => {
      const customerName = getCustomerName(inv.customerId).toLowerCase();
      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        customerName.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "ALL" || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "amount") return b.total - a.total;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const summaryTotal = filteredInvoices?.reduce((sum, inv) => sum + inv.total, 0) ?? 0;
  const summaryCount = filteredInvoices?.length ?? 0;

  
 
  return (
    <div className="space-y-6">
<div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.18)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Factures</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Gère tes factures</h1>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              Recherche, filtre et crée des factures avec un affichage clair et professionnel.
            </p>
          </div>

          <Link href="/invoices/new">
            <Button size="lg" className="gap-2">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle facture
            </Button>
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] xl:grid-cols-[1fr_auto_auto] xl:items-center">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Rechercher par numéro ou client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={(v) => v && setStatusFilter(v)}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Tous les statuts</SelectItem>
              <SelectItem value="DRAFT">Brouillon</SelectItem>
              <SelectItem value="SENT">Envoyée</SelectItem>
              <SelectItem value="PAID">Payée</SelectItem>
              <SelectItem value="OVERDUE">En retard</SelectItem>
            </SelectContent>
          </Select>

          {!isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-6 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Factures affichées</p>
                <p className="text-lg font-semibold text-slate-900">{summaryCount}</p>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Total TTC</p>
                <p className="text-lg font-semibold text-slate-900">{formatCurrency(summaryTotal)}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {isLoading && (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <Card key={i}>
        <CardContent className="flex items-center justify-between p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)}

      {!isLoading && filteredInvoices?.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center"
        >
          <FileText className="h-10 w-10 text-muted-foreground/50" />
          <h3 className="mt-4 font-medium">Aucune facture pour le moment</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Crée ta première facture pour commencer.
        </p>
        </motion.div>
      )}

      <div className="space-y-2">
        {filteredInvoices?.map((invoice, i) => (
          <motion.div
            key={invoice._id}
            layout
            initial={{ opacity: 0, y:15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.04 }}
          >
            <Link href={`/invoices/${invoice._id}`}>
              <Card className={`border-l-4 transition-colors hover:bg-muted/50 ${statusBorderColors[invoice.status]}`}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-muted-foreground">
                        {getCustomerName(invoice.customerId)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      Échéance {new Date(invoice.dueDate).toLocaleDateString("fr-FR")}
                    </span>
                    <span className="font-medium">{formatCurrency(invoice.total)}</span>
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

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-between border-t pt-6"
        >
          <div className="text-sm text-muted-foreground">
            Page {pagination.page} sur {pagination.pages} ({pagination.total} factures au total)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(pagination.pages, page + 1))}
              disabled={page === pagination.pages}
            >
              Suivant
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}