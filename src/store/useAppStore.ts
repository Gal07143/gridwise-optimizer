import { create } from 'zustand';
import { Site } from '@/types/site';

interface AppState {
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  
  // Current active site
  activeSiteId: string | null;
  activeSite: Site | null;
  setActiveSiteId: (siteId: string | null) => void;
  setActiveSite: (site: Site | null) => void;
  
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
  activeSite: null,
  setActiveSiteId: (siteId) => set({ activeSiteId: siteId }),
  setActiveSite: (site) => set({ 
    activeSite: site,
    activeSiteId: site?.id || null
  }),
  
  // Theme state
  darkMode: false,
  setDarkMode: (enabled) => set({ darkMode: enabled }),
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
}));

export default useAppStore;
