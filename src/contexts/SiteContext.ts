
import React, { createContext, useContext } from 'react';
import { Site } from '@/types/site';

export interface SiteContextType {
  sites: Site[];
  currentSite: Site | null;
  setSites: (sites: Site[]) => void;
  setCurrentSite: (site: Site | null) => void;
  isLoading: boolean;
  error: Error | null;
}

export const SiteContext = createContext<SiteContextType>({
  sites: [],
  currentSite: null,
  setSites: () => {},
  setCurrentSite: () => {},
  isLoading: false,
  error: null
});

export const useSiteContext = () => useContext(SiteContext);

export default SiteContext;
