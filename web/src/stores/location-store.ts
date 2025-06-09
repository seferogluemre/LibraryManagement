import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type LocationState = {
  city: string | null;
  district: string | null;
  error: string | null;
  isLoading: boolean;
  actions: {
    setLocation: (city: string, district: string) => void;
    setError: (error: string) => void;
    setLoading: (isLoading: boolean) => void;
  };
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
      name: "location-storage", // local storage'daki anahtar
      storage: createJSONStorage(() => localStorage),
      // Sadece bu alanları local storage'a kaydet, actions'ı kaydetme
      partialize: (state) => ({ city: state.city, district: state.district }),
    }
  )
);

export const useLocationActions = () => useLocationStore((state) => state.actions); 