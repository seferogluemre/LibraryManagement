import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarStore {
  isOpen: boolean;
  isMobile: boolean;
  setIsMobile: (mobile: boolean) => void;
  toggle: () => void;
  close: () => void;
  open: () => void;
}

export const useSidebarStore = create<SidebarStore>()(
  persist(
    (set) => ({
      isOpen: true,
      isMobile: false,

      setIsMobile: (mobile: boolean) => {
        set({
          isMobile: mobile,
          isOpen: mobile ? false : true,
        });
      },

      toggle: () =>
        set((state) => ({
          isOpen: !state.isOpen,
        })),

      close: () => set({ isOpen: false }),

      open: () => set({ isOpen: true }),
    }),
    {
      name: "sidebar-storage",
      partialize: (state) => ({
        isOpen: state.isOpen,
      }),
    }
  )
);
