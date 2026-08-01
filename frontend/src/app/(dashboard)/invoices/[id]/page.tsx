"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Loader2, Mail, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail as MailIcon } from "lucide-react";
import { useSendInvoiceEmail } from "@/hooks/use-invoices"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useInvoice, useUpdateInvoiceStatus, downloadInvoicePDF } from "@/hooks/use-invoices";
import { useCustomers } from "@/hooks/use-customers";
import { formatCurrency } from "@/lib/utils";
import { useDeleteInvoice } from "@/hooks/use-invoices";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: invoice, isLoading } = useInvoice(id);
  const { data: customers } = useCustomers();
  const updateStatus = useUpdateInvoiceStatus();
  const deleteInvoice = useDeleteInvoice();
  const [downloading, setDownloading] = useState(false);
  const sendEmail = useSendInvoiceEmail();

  const customer = customers?.find((c) => c._id === invoice?.customerId);

  const handleDownload = async () => {
    if (!invoice) return;
    setDownloading(true);
    try {
      await downloadInvoicePDF(invoice._id, invoice.invoiceNumber);
    } finally {
      setDownloading(false);
    }
  };

         const handleDelete = async () => {
  await deleteInvoice.mutateAsync(invoice!._id);
  router.push("/invoices");
 };


   if (isLoading) {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-9 w-40" />
      </div>
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-48 w-full" />
    </div>
  );
}

  if (!invoice) {
    return <p className="text-muted-foreground">Facture introuvable.</p>;
  }
  
  
  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.push("/invoices")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux factures
      </Button>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{invoice.invoiceNumber}</h1>
          <p className="text-muted-foreground">
            Échéance le {new Date(invoice.dueDate).toLocaleDateString("fr-FR")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            defaultValue={invoice.status}
            onValueChange={(v) => {
              if (v) updateStatus.mutate({ id: invoice._id, status: v });
            }}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Brouillon</SelectItem>
              <SelectItem value="SENT">Envoyée</SelectItem>
              <SelectItem value="PAID">Payée</SelectItem>
              <SelectItem value="OVERDUE">En retard</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => sendEmail.mutate(invoice._id)} disabled={sendEmail.isPending}>  {sendEmail.isPending ? (   <Loader2 className="h-4 w-4 animate-spin" />  ) : (    <MailIcon className="h-4 w-4" /> )}
          </Button>
          <Button variant="outline" onClick={handleDownload} disabled={downloading}>
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>} />
                <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Supprimer cette facture ?
                    </AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est irréversible. La facture {invoice.invoiceNumber} sera définitivement supprimée.
                        </AlertDialogDescription>
                </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Supprimer</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {customer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Client</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{customer.name}</p>
            <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" />
              {customer.email}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Articles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {invoice.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{item.description}</p>
                <p className="text-sm text-muted-foreground">
                  {item.quantity} × {formatCurrency(item.unitPrice)} · TVA {item.vatRate}%
                </p>
              </div>
              <p className="font-medium">
                {formatCurrency(item.quantity * item.unitPrice)}
              </p>
            </motion.div>
          ))}

          <div className="ml-auto w-full max-w-xs space-y-1 border-t pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sous-total HT</span>
              <span>{formatCurrency(invoice.subTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">TVA</span>
              <span>{formatCurrency(invoice.vatTotal)}</span>
            </div>
            <div className="flex justify-between text-base font-medium">
              <span>Total TTC</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <Badge variant={statusVariants[invoice.status]}>{statusLabels[invoice.status]}</Badge>
      </div>
    </div>
  );
}