
import { create } from 'zustand';

interface AppState {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  
  // Current active site
  activeSiteId: string | null;
  setActiveSiteId: (siteId: string | null) => void;
  
  // Theme mode
  darkMode: boolean;
  setDarkMode: (enabled: boolean) => void;
  toggleDarkMode: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Sidebar state
  sidebarExpanded: true,
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  
  // Active site state
  activeSiteId: null,
  setActiveSiteId: (siteId) => set({ activeSiteId: siteId }),
  
  // Theme state
  darkMode: false,
  setDarkMode: (enabled) => set({ darkMode: enabled }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));

export default useAppStore;
