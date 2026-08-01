import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";

/**
 * Hook pour gérer les erreurs réseau et les retries
 * Affiche un toast quand la connexion est rétablie
 */
export function useNetworkError() {
  const queryClient = useQueryClient();

  const handleNetworkError = useCallback((error: any) => {
    if (!error.response) {
      // Erreur réseau
      toast.error("Erreur de connexion. Vérifiez votre internet.");
      return true;
    }

    if (error.response.status === 500) {
      toast.error("Erreur serveur. Nos équipes travaillent dessus.");
      return true;
    }

    if (error.response.status === 429) {
      toast.error("Trop de requêtes. Attendez quelques secondes.");
      return true;
    }

    return false;
  }, []);

  // Rétabir les requêtes quand la connexion revient
  const retryFailedQueries = useCallback(() => {
    queryClient.refetchQueries();
    toast.success("Connexion rétablie !");
  }, [queryClient]);

  return { handleNetworkError, retryFailedQueries };
}

/**
 * Hook pour réessayer une mutation en cas d'erreur réseau
 */
export function useRetryMutation<T>(
  mutationFn: () => Promise<T>,
  options?: {
    maxRetries?: number;
    delayMs?: number;
  }
) {
  const maxRetries = options?.maxRetries ?? 3;
  const delayMs = options?.delayMs ?? 1000;

  return useCallback(
    async (attempt = 0): Promise<T> => {
      try {
        return await mutationFn();
      } catch (error: any) {
        if (!error.response && attempt < maxRetries) {
          // Erreur réseau et retries restants
          await new Promise((resolve) => setTimeout(resolve, delayMs * (attempt + 1)));
          return useRetryMutation(mutationFn, options)(attempt + 1);
        }
        throw error;
      }
    },
    [mutationFn, maxRetries, delayMs]
  );
}
