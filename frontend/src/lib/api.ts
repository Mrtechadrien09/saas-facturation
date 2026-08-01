import axios from "axios";
import { toast } from "sonner";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Interceptor de requête - Ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de réponse - Gestion des erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Erreur réseau
    if (!error.response) {
      console.error("❌ Erreur réseau:", error);
      // Ne pas afficher de toast ici, laisser le composant le faire
      return Promise.reject({
        ...error,
        isNetworkError: true,
        message: "Erreur de connexion. Vérifiez votre internet."
      });
    }

    // Authentification expirée
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    // Erreur serveur
    if (error.response?.status === 500) {
      console.error("❌ Erreur serveur:", error.response?.data);
      return Promise.reject({
        ...error,
        message: "Erreur serveur interne. Réessayez plus tard."
      });
    }

    // Trop de requêtes
    if (error.response?.status === 429) {
      return Promise.reject({
        ...error,
        message: "Trop de requêtes. Attendez quelques secondes."
      });
    }

    return Promise.reject(error);
  }
);