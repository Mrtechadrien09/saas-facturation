"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Plus, Trash2, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomers } from "@/hooks/use-customers";
import { useCreateInvoice } from "@/hooks/use-invoices";
import { formatCurrency } from "@/lib/utils";

const itemSchema = z.object({
  description: z.string().min(1, "Description requise"),
  quantity: z.coerce.number().min(1, "Min 1"),
  unitPrice: z.coerce.number().min(0, "Prix invalide"), // saisi en euros, converti en centimes à l'envoi
  vatRate: z.coerce.number().min(0).max(100),
});

const invoiceSchema = z.object({
  customerId: z.string().min(1, "Sélectionne un client"),
  dueDate: z.string().min(1, "Date requise"),
  status: z.enum(["DRAFT", "SENT", "PAID", "OVERDUE"]),
  items: z.array(itemSchema).min(1, "Ajoute au moins un article"),
});

type InvoiceFormInput = z.input<typeof invoiceSchema>;   // avant coercion (ce que le formulaire manipule)
type InvoiceFormOutput = z.output<typeof invoiceSchema>; // après coercion (ce qu'on envoie à l'API)

export default function NewInvoicePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedCustomerId = searchParams.get("customerId");
  const { data: customers, isLoading: customersLoading } = useCustomers();
  const createInvoice = useCreateInvoice();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvoiceFormInput>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      status: "DRAFT",
      items: [{ description: "", quantity: 1, unitPrice: 0, vatRate: 20 }],
    },
  });

  useEffect(() => {
  if (preselectedCustomerId) {
    setValue("customerId", preselectedCustomerId);
  }
}, [preselectedCustomerId, setValue]);

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const items = watch("items");

  const subTotal = items.reduce((sum, item) => {
  const qty = Number(item.quantity) || 0;
  const price = Number(item.unitPrice) || 0;
  return sum + qty * price;
}, 0);

const vatTotal = items.reduce((sum, item) => {
  const qty = Number(item.quantity) || 0;
  const price = Number(item.unitPrice) || 0;
  const vat = Number(item.vatRate) || 0;
  return sum + qty * price * (vat / 100);
}, 0);


  const total = subTotal + vatTotal;

  const onSubmit = async (data: InvoiceFormOutput) => {
    setError(null);
    try {
      const payload = {
        customerId: data.customerId,
        dueDate: data.dueDate,
        status: data.status,
        items: data.items.map((item) => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: Math.round(item.unitPrice * 100), // conversion en centimes
          vatRate: item.vatRate,
        })),
      };
      const invoice = await createInvoice.mutateAsync(payload);
      router.push(`/invoices/${invoice._id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur lors de la création de la facture");
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.25)]"
      >
        <Button variant="ghost" size="sm" onClick={() => router.push("/invoices")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux factures
        </Button>

        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Facturation</p>
          <h1 className="mt-3 text-4xl font-bold text-slate-900">
            Nouvelle facture
          </h1>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Crée une facture détaillée, choisis le client, définis les articles et envoie tout en un clic.
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
        {/* 📋 Informations générales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="h-8 w-1 bg-blue-600 rounded-full"></span>
                Informations générales
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label className="font-semibold">Client</Label>
                <Select
                  value={preselectedCustomerId ?? undefined}
                  onValueChange={(v) => {
                    if (v) setValue("customerId", v as string);
                  }}
                  disabled={customersLoading}
                >
                  <SelectTrigger className="focus-ring">
                    <SelectValue placeholder="Sélectionne un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers?.map((c) => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.customerId && (
                  <p className="text-sm text-red-600 font-medium">{errors.customerId.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate" className="font-semibold">
                  Date d'échéance
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  {...register("dueDate")}
                  className="focus-ring"
                />
                {errors.dueDate && (
                  <p className="text-sm text-red-600 font-medium">{errors.dueDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="font-semibold">Statut</Label>
                <Select
                  defaultValue="DRAFT"
                  onValueChange={(v) => v && setValue("status", v as InvoiceFormInput["status"])}
                >
                  <SelectTrigger className="focus-ring">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">📝 Brouillon</SelectItem>
                    <SelectItem value="SENT">📤 Envoyée</SelectItem>
                    <SelectItem value="PAID">✅ Payée</SelectItem>
                    <SelectItem value="OVERDUE">⚠️ En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 📦 Articles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card className="shadow-sm transition-shadow duration-300 hover:shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="flex items-center gap-2">
                <span className="h-8 w-1 bg-blue-600 rounded-full"></span>
                Articles
              </CardTitle>
              <Button
                type="button"
                variant="success"
                size="sm"
                onClick={() => append({ description: "", quantity: 1, unitPrice: 0, vatRate: 20 })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="grid grid-cols-12 gap-2 items-end p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg border border-slate-200 dark:border-slate-800"
                >
                  <div className="col-span-5 space-y-1">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Description</Label>
                    <Input
                      {...register(`items.${index}.description`)}
                      placeholder="Ex: Conseil..."
                      className="focus-ring"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Qté</Label>
                    <Input
                      type="number"
                      step="1"
                      {...register(`items.${index}.quantity`)}
                      className="focus-ring"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">Prix (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.unitPrice`)}
                      className="focus-ring"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">TVA (%)</Label>
                    <Input
                      type="number"
                      step="1"
                      {...register(`items.${index}.vatRate`)}
                      className="focus-ring"
                    />
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
              {errors.items?.root && (
                <p className="text-sm text-red-600 font-medium">{errors.items.root.message}</p>
              )}

              {/* 📊 Résumé */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="ml-auto w-full max-w-xs space-y-2 border-t-2 border-blue-200 dark:border-blue-900 pt-4 text-sm bg-gradient-to-br from-blue-50 to-blue-50/30 dark:from-blue-950/20 dark:to-blue-950/10 p-4 rounded-lg"
              >
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span className="font-medium">Sous-total HT</span>
                  <span className="font-semibold">{formatCurrency(Math.round(subTotal * 100))}</span>
                </div>
                <div className="flex justify-between text-slate-700 dark:text-slate-300">
                  <span className="font-medium">TVA</span>
                  <span className="font-semibold text-amber-600">{formatCurrency(Math.round(vatTotal * 100))}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-blue-600 dark:text-blue-400 border-t pt-2">
                  <span>Total TTC</span>
                  <span>{formatCurrency(Math.round(total * 100))}</span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ⚠️ Messages d'erreur */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-red-50 dark:bg-red-950/20 border-l-4 border-red-600 rounded text-red-700 dark:text-red-400 font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* 💾 Bouton de soumission */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <Button
            type="submit"
            disabled={createInvoice.isPending}
            variant="success"
            size="lg"
            className="gap-2"
          >
            {createInvoice.isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                ✅ Créer la facture
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => router.push("/invoices")}
          >
            Annuler
          </Button>
        </motion.div>
      </form>
    </div>
  );
}