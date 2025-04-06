
import { create } from 'zustand';
import { Site } from '@/types/site';
import { mockSites } from '@/services/sites/mockSites';

interface AppState {
  // Sidebar state
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
  setSidebarExpanded: (expanded: boolean) => void;
  
  // Site management
  sites: Site[];
  sitesLoading: boolean;
  activeSite: Site | null;
  setSites: (sites: Site[]) => void;
  setActiveSite: (site: Site | null) => void;
  
  // Theme management
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Default sidebar state
  sidebarExpanded: true,
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
  setSidebarExpanded: (expanded: boolean) => set({ sidebarExpanded: expanded }),
  
  // Default site state with mock data for immediate usability
  sites: mockSites,
  sitesLoading: false,
  activeSite: mockSites.length > 0 ? mockSites[0] : null,
  setSites: (sites: Site[]) => set({ sites }),
  setActiveSite: (site: Site | null) => set({ activeSite: site }),
  
  // Default theme
  theme: 'light',
  setTheme: (theme: 'light' | 'dark' | 'system') => set({ theme }),
}));
