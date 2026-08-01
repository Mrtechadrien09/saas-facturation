import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Customer } from "@/types/customer";
import { toast } from "sonner";

export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data } = await api.get("/customers");
      return data.data as Customer[];
    },
  });
}

export function useCustomer(id: string) {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: async () => {
      const { data } = await api.get(`/customers/${id}`);
      return data.data as Customer;
    },
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Customer>) => {
      const { data } = await api.post("/customers", payload);
      return data.data as Customer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Client créé avec succès");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erreur lors de la création du client");
    }
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Customer> }) => {
      const { data } = await api.put(`/customers/${id}`, payload);
      return data.data as Customer;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["customers", variables.id] });
      toast.success("Client mis à jour");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erreur lors de la modification");
    }
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/customers/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast.success("Client supprimé");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Erreur lors de la suppression");
    }
  });
}