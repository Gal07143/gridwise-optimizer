
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
}

export const useAppStore = create<AppState>((set) => ({
  activeSite: mockSites.length > 0 ? mockSites[0] : null,
  sites: mockSites,
  setActiveSite: (site) => set({ activeSite: site }),
  setSites: (sites) => set({ sites }),
  loading: false,
  setLoading: (loading) => set({ loading }),
}));

export default useAppStore;
