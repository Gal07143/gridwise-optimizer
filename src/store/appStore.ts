
import { create } from 'zustand';
import { Site } from '@/types/site';
import mockSites from '@/services/sites/mockSites';

interface AppState {
  activeSite: Site | null;
  sites: Site[];
  setActiveSite: (site: Site) => void;
  setSites: (sites: Site[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  // Add missing sidebar state properties
  sidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeSite: mockSites.length > 0 ? mockSites[0] : null,
  sites: mockSites,
  setActiveSite: (site) => set({ activeSite: site }),
  setSites: (sites) => set({ sites }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  // Initialize sidebar state
  sidebarExpanded: true,
  setSidebarExpanded: (expanded) => set({ sidebarExpanded: expanded }),
  toggleSidebar: () => set((state) => ({ sidebarExpanded: !state.sidebarExpanded })),
}));

export default useAppStore;
