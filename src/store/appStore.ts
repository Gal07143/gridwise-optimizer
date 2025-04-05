
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Site } from '@/types/site';

export interface AppState {
  sidebarExpanded: boolean;
  activeTab: string;
  activeDashboardView: string;
  isLoading: boolean;
  activeSite: Site | null;
  
  // Actions
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
  setActiveDashboardView: (view: string) => void;
  setIsLoading: (loading: boolean) => void;
  setActiveSite: (site: Site | null) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        sidebarExpanded: true,
        activeTab: 'overview',
        activeDashboardView: 'grid',
        isLoading: false,
        activeSite: null,
        
        // Actions
        setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
        toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
        setActiveTab: (tab) => set({ activeTab: tab }),
        setActiveDashboardView: (view) => set({ activeDashboardView: view }),
        setIsLoading: (loading) => set({ isLoading: loading }),
        setActiveSite: (site) => set({ activeSite: site }),
      }),
      {
        name: 'ems-app-storage',
      }
    )
  )
);

export default useAppStore;
