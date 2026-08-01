"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Users, FileText, Clock, Plus } from "lucide-react";
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
  },
  {
    key: "totalCustomers" as const,
    label: "Clients",
    icon: Users,
    format: (v: number) => v.toString(),
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    key: "totalInvoices" as const,
    label: "Factures",
    icon: FileText,
    format: (v: number) => v.toString(),
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    key: "unpaidInvoices" as const,
    label: "En attente",
    icon: Clock,
    format: (v: number) => v.toString(),
    color: "text-amber-600",
    bg: "bg-amber-50",
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
        className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.25)]"
      >
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tableau de bord</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900 sm:text-4xl">
              {greeting}{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
            </h1>
            <p className="mt-3 text-slate-600 leading-7">
              Ton espace facturation clair et rapide : clients, factures et trésorerie au même endroit.
            </p>
          </div>

          <div className="grid gap-3 sm:auto-cols-max sm:grid-flow-col">
            <Link href="/invoices/new" className="w-full sm:w-auto">
              <Button variant="default" size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-blue-500/30">
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
          className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg"
        >
          <p className="text-sm text-red-700 dark:text-red-400">
            ⚠️ Impossible de charger les statistiques. Vérifie que ton backend tourne bien.
          </p>
        </motion.div>
      )}

      {/* 📊 Stat Cards - Grid responsive */}
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
              <Card className="shadow-sm transition-shadow duration-300 hover:shadow-xl border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.label}
                  </CardTitle>
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold tabular-nums">
                    {isLoading ? <Skeleton className="h-8 w-24 rounded" /> : stat.format(value)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* 📈 Charts section - Responsive */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-sm transition-shadow duration-300 hover:shadow-lg border-0">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Revenu des 6 derniers mois</CardTitle>
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
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", r: 5 }}
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
        >
          <Card className="shadow-sm transition-shadow duration-300 hover:shadow-lg h-full border-0">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Factures récentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentLoading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full rounded-lg" />
                ))}

              {!recentLoading && recentInvoices?.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Aucune facture pour le moment.</p>
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
                    <div className="group flex items-center justify-between rounded-lg p-3 bg-slate-50 dark:bg-slate-900/30 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 cursor-pointer border border-transparent hover:border-blue-200 dark:hover:border-blue-800">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate">
                          {invoice.invoiceNumber}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {getCustomerName(invoice.customerId)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 ml-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                          {formatCurrency(invoice.total)}
                        </span>
                        <Badge
                          variant={statusVariants[invoice.status]}
                          className="text-[10px] font-semibold"
                        >
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