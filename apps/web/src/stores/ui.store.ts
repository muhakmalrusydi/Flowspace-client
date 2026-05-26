import { create } from "zustand";

// ─── UI store ─────────────────────────────────────────────────────────────────
// Manages ephemeral UI state that doesn't belong in the server cache.
// Examples: sidebar open/close, active modal, theme preference.

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Active modal
  activeModal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;

  // Theme
  theme: "light" | "dark" | "system";
  setTheme: (theme: "light" | "dark" | "system") => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Modal
  activeModal: null,
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),

  // Theme
  theme: "system",
  setTheme: (theme) => set({ theme }),
}));
