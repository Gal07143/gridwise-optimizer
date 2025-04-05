
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export interface AppState {
  sidebarExpanded: boolean;
  activeTab: string;
  activeDashboardView: string;
  isLoading: boolean;
  
  // Actions
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  setActiveTab: (tab: string) => void;
  setActiveDashboardView: (view: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        sidebarExpanded: true,
        activeTab: 'overview',
        activeDashboardView: 'grid',
        isLoading: false,
        
        // Actions
        setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
        toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
        setActiveTab: (tab) => set({ activeTab: tab }),
        setActiveDashboardView: (view) => set({ activeDashboardView: view }),
        setIsLoading: (loading) => set({ isLoading: loading }),
      }),
      {
        name: 'ems-app-storage',
      }
    )
  )
);

export default useAppStore;
