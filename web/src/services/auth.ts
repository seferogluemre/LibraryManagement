import { api } from "@/lib/api";
import { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const loginSchema = z.object({
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz." }),
  password: z.string().min(1, { message: "Şifre boş bırakılamaz." }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
};

export type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  loginTimestamp: number | null;
  login: (data: LoginFormData) => Promise<void>;
  setAuthData: (data: { user: User; accessToken: string; refreshToken: string }) => void;
  logout: () => void;
};

type UserLoginResponse = AuthState;

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      loginTimestamp: null,
      login: async (data) => {
        const response = await api.auth.login.post({ json: data });
        if (!response.ok) {
          throw new Error("Giriş başarısız");
        }
        const { user, accessToken, refreshToken } = await response.json();
        console.log(user, accessToken, refreshToken);
        set({ user, accessToken, refreshToken, loginTimestamp: Date.now() });
      },
      setAuthData: (data) => {
        set({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken, loginTimestamp: Date.now() });
      },
      logout: () => {
        set({ user: null, accessToken: null, refreshToken: null, loginTimestamp: null });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        loginTimestamp: state.loginTimestamp,
      }),
    }
  )
);

export const useAuth = useAuthStore;

export function getAuthState(): AuthState {
  const state = useAuthStore.getState();
  return {
    accessToken: state.accessToken,
    refreshToken: state.refreshToken,
    user: state.user,
    loginTimestamp: state.loginTimestamp,
    login: () => Promise.resolve(),
    logout: () => {},
    setAuthData: () => {},
  };
}

export function setAuthState(data: UserLoginResponse) {
  // Bu fonksiyon artık deprecated, setAuthData kullanın
  useAuthStore.getState().setAuthData({
    user: data.user!,
    accessToken: data.accessToken!,
    refreshToken: data.refreshToken!,
  });
}

export function clearLocalStorageAuthState() {
  useAuthStore.getState().logout();
}

export const getAccessToken = () => {
  return useAuthStore.getState().accessToken;
};

export const getLoginTimestamp = () => {
  return useAuthStore.getState().loginTimestamp;
};

export const getRefreshToken = () => {
  return useAuthStore.getState().refreshToken;
};

export const getLocalUser = () => {
  return useAuthStore.getState().user;
};