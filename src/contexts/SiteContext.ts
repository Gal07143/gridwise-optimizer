
import React, { createContext, useContext } from 'react';
import { Site } from '@/types/site';

export interface SiteContextType {
  sites: Site[];
  currentSite: Site | null;
  activeSite: Site | null; // Alias for backward compatibility
  setSites: (sites: Site[]) => void;
  setCurrentSite: (site: Site | null) => void;
  setActiveSite: (site: Site) => void;
  isLoading: boolean;
  loading: boolean; // Alias for backward compatibility
  error: Error | null;
  refreshSites: () => Promise<void>;
}

export const SiteContext = createContext<SiteContextType>({
  sites: [],
  currentSite: null,
  activeSite: null,
  setSites: () => {},
  setCurrentSite: () => {},
  setActiveSite: () => {},
  isLoading: false,
  loading: false,
  error: null,
  refreshSites: async () => {}
});

export const useSiteContext = () => useContext(SiteContext);

export { SiteProvider } from './SiteContext.tsx';

export default SiteContext;
