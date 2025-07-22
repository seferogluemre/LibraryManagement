import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type LocationState = {
  city: string | null;
  district: string | null;
  error: string | null;
  isLoading: boolean;
  actions: {
    setLocation: (city: string, district: string) => void;
    setError: (error: string | null) => void;
    setLoading: (loading: boolean) => void;
  };
};

type PersistedState = {
  city: string | null;
  district: string | null;
};

export const useLocationStore = create(
  persist<LocationState>(
    (set) => ({
      city: null,
      district: null,
      error: null,
      isLoading: false,
      actions: {
        setLocation: (city, district) =>
          set({ city, district, isLoading: false, error: null }),
        setError: (error) => set({ error, isLoading: false }),
        setLoading: (isLoading) => set({ isLoading }),
      },
    }),
    {
      name: "location-storage", // local storage'daki key
      storage: createJSONStorage(() => localStorage), // (opsiyonel) varsayılan olarak localStorage kullanılır
      partialize: (state): PersistedState => ({
        city: state.city,
        district: state.district,
      }),
    }
  )
);

export const useLocationActions = () => useLocationStore((state) => state.actions); 