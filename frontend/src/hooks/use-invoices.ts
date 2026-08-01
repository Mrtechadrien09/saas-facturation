import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Invoice } from "@/types/invoices.js";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface InvoicesResponse {
  data: Invoice[];
  pagination?: PaginationMeta;
}

export function useInvoices(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["invoices", page, limit],
    queryFn: async () => {
      const { data } = await api.get<InvoicesResponse>("/invoices", {
        params: { page, limit }
      });
      return data;
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      customerId: string;
      dueDate: string;
      status: string;
      items: { description: string; quantity: number; unitPrice: number; vatRate: number }[];
    }) => {
      const { data } = await api.post("/invoices", payload);
      return data.data as Invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Facture crée");
    },
        onError: (err: any) => {
        toast.error(err.response?.data?.message || "Erreur lors de la création");
    },
  });
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: async () => {
      const { data } = await api.get(`/invoices/${id}`);
      return data.data as Invoice;
    },
    enabled: !!id,
  });
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await api.patch(`/invoices/${id}/status`, { status });
      return data.data as Invoice;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices", variables.id] });
      toast.success("Statut mis à jour");
    },
        onError: (err: any) => {
        toast.error(err.response?.data?.message || "Erreur lors de la mise à jour du statut");
    },
  });
}

export async function downloadInvoicePDF(id: string, invoiceNumber: string) {
  const response = await api.get(`/invoices/${id}/pdf`, { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `facture-${invoiceNumber}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/invoices/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Facture supprimée");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erreur lors de la suppression");
    },
  });
}

export function useSendInvoiceEmail() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/invoices/${id}/send`);
      return data;
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoices", id] });
      toast.success("Facture envoyée par email");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erreur lors de l'envoi de l'email");
    },
  });
}

export function useRecentInvoices(limit = 5) {
  const { data: response, ...rest } = useInvoices();
  return {
    ...rest,
    data: response?.data?.slice(0, limit), // déjà triées par date décroissante côté backend
  };
}


// Hook pour récupérer les factures d'un client spécifique
export function useCustomerInvoices(
  customerId: string, 
  page: number = 1, 
  limit: number = 10
) {
  return useQuery({
    queryKey: ["customer-invoices", customerId, page, limit],
    queryFn: async () => {
      const { data } = await api.get<InvoicesResponse>("/invoices", {
        params: { 
          customerId, 
          page, 
          limit 
        }
      });
      return data.data || [];
    },
    enabled: !!customerId,
  });
}