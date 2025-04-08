
import { create } from 'zustand';
import { Site } from '@/types/energy';
import { mockSites } from '@/services/sites/mockSites';

interface AppState {
  sites: Site[];
  currentSite: Site | null;
  setCurrentSite: (site: Site) => void;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  menuCollapsed: boolean;
  setMenuCollapsed: (collapsed: boolean) => void;
  toggleMenu: () => void;
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
  activeSite: Site | null;
  setActiveSite: (site: Site | null) => void;
  dashboardView: 'overview' | 'analytics' | 'devices' | 'energy';
  setDashboardView: (view: 'overview' | 'analytics' | 'devices' | 'energy') => void;
}

export const useAppStore = create<AppState>((set) => ({
  sites: mockSites,
  currentSite: mockSites.length > 0 ? mockSites[0] : null,
  setCurrentSite: (site) => set({ currentSite: site, activeSite: site }),
  theme: 'system',
  setTheme: (theme) => set({ theme }),
  menuCollapsed: false,
  setMenuCollapsed: (collapsed) => set({ menuCollapsed: collapsed }),
  toggleMenu: () => set((state) => ({ menuCollapsed: !state.menuCollapsed })),
  sidebarExpanded: true,
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  activeSite: mockSites.length > 0 ? mockSites[0] : null,
  setActiveSite: (site) => set({ activeSite: site }),
  dashboardView: 'overview',
  setDashboardView: (view) => set({ dashboardView: view }),
}));

// Export both as default and named export for compatibility
export default useAppStore;
