import { create } from 'zustand';

interface AppState {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarExpanded: true,
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  activeTab: 'overview',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
