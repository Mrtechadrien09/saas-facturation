import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Settings } from "@/types/settings.js";

const defaultSettings: Settings = {
  companyInfo: { name: "", siret: "", phone: "", email: "", website: "" },
  address: { street: "", city: "", zipCode: "", country: "France" },
  financials: { currency: "EUR", defaultVatRate: 20 },
};

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await api.get("/settings");
      const settings = data?.settings ?? defaultSettings;
      return {
        ...defaultSettings,
        ...settings,
        companyInfo: { ...defaultSettings.companyInfo, ...(settings?.companyInfo ?? {}) },
        address: { ...defaultSettings.address, ...(settings?.address ?? {}) },
        financials: { ...defaultSettings.financials, ...(settings?.financials ?? {}) },
      } as Settings;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Settings) => {
      const { data } = await api.put("/settings", payload);
      const settings = data?.settings ?? payload;
      return {
        ...defaultSettings,
        ...settings,
        companyInfo: { ...defaultSettings.companyInfo, ...(settings?.companyInfo ?? {}) },
        address: { ...defaultSettings.address, ...(settings?.address ?? {}) },
        financials: { ...defaultSettings.financials, ...(settings?.financials ?? {}) },
      } as Settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}