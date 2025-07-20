import { create } from "zustand";

export type User = {
  name: string;
  email: string;
  avatarURL: string;
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearIsAuthenticated: () => set({ user: null, isAuthenticated: false }),
}));
