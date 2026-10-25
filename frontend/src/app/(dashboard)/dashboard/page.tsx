"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Users, FileText, Clock, Plus, ArrowUpRight, Wallet, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { InvoiceStatus, Invoice } from "@/types/invoices";
import { useAuth } from "@/hooks/use-auth";
import { useInvoices, useRecentInvoices } from "@/hooks/use-invoices";
import { useCustomers } from "@/hooks/use-customers";
import { Button } from "@/components/ui/button";

interface InvoiceStatusStat {
  count: number;
  totalHT: number;
  totalTTC: number;
}

type InvoiceStats = Record<InvoiceStatus, InvoiceStatusStat>;

interface DashboardStats {
  totalRevenue: number;
  totalCustomers: number;
  totalInvoices: number;
  unpaidInvoices: number;
}

async function fetchStats(): Promise<DashboardStats> {
  const [customersRes, invoiceStatsRes] = await Promise.all([
    api.get("/customers"),
    api.get("/invoices/stats"),
  ]);

  const customers = customersRes.data.data as any[];
  const stats = invoiceStatsRes.data.data as InvoiceStats;

  const totalRevenue = stats.PAID.totalTTC;
  const totalInvoices =
    stats.PAID.count + stats.SENT.count + stats.DRAFT.count + stats.OVERDUE.count;
  const unpaidInvoices = stats.SENT.count + stats.OVERDUE.count;

  return { totalRevenue, totalCustomers: customers.length, totalInvoices, unpaidInvoices };
}

const statCards = [
  {
    key: "totalRevenue" as const,
    label: "Revenu total",
    icon: DollarSign,
    format: (v: number) => formatCurrency(v),
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    accent: "from-emerald-500 to-teal-500",
    ring: "ring-emerald-100",
  },
  {
    key: "totalCustomers" as const,
    label: "Clients",
    icon: Users,
    format: (v: number) => v.toString(),
    color: "text-[#2B3A67]",
    bg: "bg-[#edf3ff]",
    accent: "from-[#2B3A67] to-[#455a9a]",
    ring: "ring-blue-100",
  },
  {
    key: "totalInvoices" as const,
    label: "Factures",
    icon: FileText,
    format: (v: number) => v.toString(),
    color: "text-violet-600",
    bg: "bg-violet-50",
    accent: "from-violet-500 to-indigo-500",
    ring: "ring-violet-100",
  },
  {
    key: "unpaidInvoices" as const,
    label: "En attente",
    icon: Clock,
    format: (v: number) => v.toString(),
    color: "text-amber-600",
    bg: "bg-amber-50",
    accent: "from-amber-400 to-orange-500",
    ring: "ring-amber-100",
  },
];

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

function buildMonthlyRevenue(invoices: Invoice[] | undefined) {
  if (!invoices) return [];

  const now = new Date();
  const months: { key: string; label: string; revenue: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: d.toLocaleDateString("fr-FR", { month: "short" }),
      revenue: 0,
    });
  }

  invoices
    .filter((inv) => inv.status === "PAID")
    .forEach((inv) => {
      const d = new Date(inv.issueDate || inv.createdAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      const month = months.find((m) => m.key === key);
      if (month) month.revenue += inv.total / 100;
    });

  return months;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchStats,
  });
  const { data: allInvoicesData } = useInvoices();
  const { data: recentInvoices, isLoading: recentLoading } = useRecentInvoices(5);
  const { data: customers } = useCustomers();

  const chartData = buildMonthlyRevenue(allInvoicesData?.data);

  const getCustomerName = (customerId: string) =>
    customers?.find((c) => c._id === customerId)?.name || "Client inconnu";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";
  const today = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[2rem] border border-slate-200 bg-gradient-to-br from-[#2B3A67] via-[#30497f] to-[#1f2b4d] p-6 text-white shadow-[0_35px_90px_-40px_rgba(43,58,103,0.9)]"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-200">Tableau de bord</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">
              {greeting}{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-200/90">
              Ton espace facturation clair et rapide : clients, factures et trésorerie au même endroit.
            </p>
          </div>

          <div className="grid gap-3 sm:auto-cols-max sm:grid-flow-col">
            <Link href="/invoices/new" className="w-full sm:w-auto">
              <Button variant="default" size="lg" className="w-full gap-2 bg-[#C9A227] text-slate-950 hover:bg-[#d8b645] sm:w-auto">
                <Plus className="h-5 w-5" />
                Nouvelle facture
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      {isError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-200 bg-red-50 p-4"
        >
          <p className="text-sm text-red-700">
            ⚠️ Impossible de charger les statistiques. Vérifie que ton backend tourne bien.
          </p>
        </motion.div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          const value = data?.[stat.key] ?? 0;

          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
            >
              <Card className="overflow-hidden border-0 bg-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.55)] ring-1 ring-slate-200/80 transition-all duration-300 hover:shadow-[0_26px_60px_-30px_rgba(15,23,42,0.6)]">
                <div className={`h-1.5 bg-gradient-to-r ${stat.accent}`} />
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 pt-4">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    {stat.label}
                  </CardTitle>
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg} ring-1 ${stat.ring}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="pb-5 pt-0">
                  <div className="flex items-end justify-between gap-3">
                    <div className="text-2xl font-bold tracking-tight text-slate-900 tabular-nums">
                      {isLoading ? <Skeleton className="h-8 w-24 rounded" /> : stat.format(value)}
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-medium text-emerald-700">
                      <ArrowUpRight className="h-3 w-3" />
                      +12%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <Card className="border-0 bg-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.6)]">
            <CardHeader className="flex flex-row items-center justify-between gap-3 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Performance</p>
                <CardTitle className="mt-2 text-lg font-bold text-slate-900">Revenu des 6 derniers mois</CardTitle>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <TrendingUp className="h-3.5 w-3.5" />
                8.4% hausse
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${v}€`}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${(value).toFixed(2)} €`, "Revenu"]}
                    contentStyle={{
                      borderRadius: 10,
                      fontSize: 13,
                      backgroundColor: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2B3A67"
                    strokeWidth={3}
                    dot={{ fill: "#2B3A67", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-4"
        >
          <Card className="h-full border-0 bg-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.6)]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">Statut des factures</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(statusLabels).map(([key, label]) => {
                const count = allInvoicesData?.data.filter((invoice) => invoice.status === key).length ?? 0;

                return (
                  <div key={key} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Badge variant={statusVariants[key]}>{label}</Badge>
                    </div>
                    <span className="font-bold text-slate-900">{count}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-[#f8faff] to-[#eef3ff] shadow-[0_20px_50px_-35px_rgba(43,58,103,0.8)]">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900">Aperçu rapide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-[#dfe7ff] bg-white p-4 shadow-sm">
                <p className="text-sm text-slate-500">Aujourd’hui</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{today}</p>
              </div>
              <div className="rounded-2xl border border-[#dfe7ff] bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Reste à facturer</p>
                  <Wallet className="h-4 w-4 text-[#2B3A67]" />
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900">{data?.unpaidInvoices ?? 0}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-4 lg:grid-cols-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <Card className="border-0 bg-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.6)]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Dernières activités</p>
                  <CardTitle className="mt-2 text-lg font-bold text-slate-900">Factures récentes</CardTitle>
                </div>
                <Link href="/invoices" className="text-sm font-medium text-[#2B3A67]">
                  Voir tout
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}

              {!recentLoading && recentInvoices?.length === 0 && (
                <div className="py-8 text-center">
                  <p className="text-sm text-slate-500">Aucune facture pour le moment.</p>
                </div>
              )}

              {recentInvoices?.map((invoice, idx) => (
                <motion.div
                  key={invoice._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link href={`/invoices/${invoice._id}`}>
                    <div className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 transition-all duration-300 hover:bg-slate-100">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {getCustomerName(invoice.customerId)}
                        </p>
                      </div>
                      <div className="ml-2 flex flex-col items-end gap-1">
                        <span className="text-sm font-bold text-slate-900">
                          {formatCurrency(invoice.total)}
                        </span>
                        <Badge variant={statusVariants[invoice.status]} className="text-[10px] font-semibold">
                          {statusLabels[invoice.status]}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}