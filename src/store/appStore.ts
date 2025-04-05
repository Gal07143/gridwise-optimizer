
import { create } from 'zustand';

interface AppState {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarExpanded: true,
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
