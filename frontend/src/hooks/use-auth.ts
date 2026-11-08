import { create } from "zustand";
import { api } from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  companyName?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, companyName?: string) => Promise<void>;
  completeSocialLogin: (token: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  logout: () => void;
  init: () => void;
}

export const useAuth = create<AuthState>((set) => {
  const refreshUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    try {
      const { data } = await api.get("/auth/me");
      localStorage.setItem("user", JSON.stringify(data));
      set({ user: data, isAuthenticated: true });
    } catch {
      const fallbackUser = {
        _id: "oauth-user",
        name: "Compte connecté",
        email: "",
      };
      localStorage.setItem("user", JSON.stringify(fallbackUser));
      set({ user: fallbackUser, isAuthenticated: true });
    }
  };

  return {
    user: null,
    isAuthenticated: false,

    login: async (email, password) => {
      const { data } = await api.post("/auth/login", { email, password });
      const { token, ...user } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      set({ user, isAuthenticated: true });
    },

    register: async (name, email, password, companyName) => {
      await api.post("/auth/register", { name, email, password, companyName });
      set({ user: null, isAuthenticated: false });
    },

    completeSocialLogin: async (token) => {
      localStorage.setItem("token", token);
      await refreshUser();
    },

    refreshUser,

    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      set({ user: null, isAuthenticated: false });
    },

    init: () => {
      try {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token) {
          if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            set({ user: parsedUser, isAuthenticated: true });
            return;
          }

          void refreshUser();
          return;
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }

      set({ user: null, isAuthenticated: false });
    },
  };
});