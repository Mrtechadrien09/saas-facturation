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
  logout: () => void;
  init: () => void;
}

export const useAuth = create<AuthState>((set) => ({
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
    const { data } = await api.post("/auth/register", { name, email, password, companyName });
    const { token, ...user } = data.data || data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, isAuthenticated: false });
  },

  init: () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (token && savedUser) {
      set({ user: JSON.parse(savedUser), isAuthenticated: true });
    }
  },
}));