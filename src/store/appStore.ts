
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
}));

export default useAppStore;
