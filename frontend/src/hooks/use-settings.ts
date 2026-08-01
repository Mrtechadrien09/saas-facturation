import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Settings } from "@/types/settings.js";

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await api.get("/settings");
      return data.settings as Settings; // ⚠️ backend renvoie "settings", pas "data"
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Settings) => {
      const { data } = await api.put("/settings", payload);
      return data.settings as Settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}