import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  loginUserAPI,
  logoutUserAPI,
  refreshTokenAPI,
  registerUserAPI,
} from "@/utils/api";
import { ApiError } from "@/types/api_error";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  token: string;
}

interface AuthState {
  user: UserData | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (
    first: string,
    last: string,
    pass: string,
    email: string,
    phone: string
  ) => Promise<{ error?: string }>;
  logout: () => void;
  checkToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          const data = await loginUserAPI(email, password);
          if (data?.token) {
            const user = {
              firstName: data.first_name,
              lastName: data.last_name,
              email: data.primary_email,
              phone: data.primary_phone,
              token: data.token,
            };
            set({ user, isAuthenticated: true });
            return { error: undefined };
          }
          return { error: "Credenciales inválidas" };
        } catch (e) {
          return {
            error: e instanceof ApiError ? e.message : "Error de conexión",
          };
        }
      },

      register: async (
        firstName,
        lastName,
        password,
        primaryEmail,
        primaryPhone
      ) => {
        try {
          const dataUser = await registerUserAPI(
            firstName,
            lastName,
            password,
            primaryEmail,
            primaryPhone !== "" ? primaryPhone : undefined
          );

          if (dataUser?.token) {
            const user = {
              firstName: dataUser.first_name,
              lastName: dataUser.last_name,
              email: dataUser.primary_email,
              phone: dataUser.primary_phone,
              token: dataUser.token,
            };
            set({ user, isAuthenticated: true });
            return { error: undefined };
          }
          return { error: "Error al registrar usuario" };
        } catch (e) {
          return {
            error: e instanceof ApiError ? e.message : "Error de conexión",
          };
        }
      },

      logout: async () => {
        const token = get().user?.token;
        if (token) await logoutUserAPI(token).catch(() => {});
        set({ user: null, isAuthenticated: false });
      },

      checkToken: async () => {
        const token = get().user?.token;
        if (!token) return;
        try {
          const data = await refreshTokenAPI(token);
          if (!data?.token) throw new Error();
        } catch {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
