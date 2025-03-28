import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Site } from '@/types/site';
import { getSites } from '@/services/sites/siteService';

export interface SiteContextType {
  sites: Site[];
  activeSite: Site | null;
  currentSite: Site | null; // Alias for activeSite for backward compatibility
  loading: boolean;
  error: Error | null;
  setActiveSite: (site: Site) => void;
  refreshSites: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType>({
  sites: [],
  activeSite: null,
  currentSite: null,
  loading: false,
  error: null,
  setActiveSite: () => {},
  refreshSites: async () => {}
});

interface SiteProviderProps {
  children: ReactNode;
}

export const SiteProvider: React.FC<SiteProviderProps> = ({ children }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [activeSite, setActiveSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const sitesData = await getSites();
      setSites(sitesData);
      
      // If no active site is set, set the first site as active
      if (!activeSite && sitesData.length > 0) {
        setActiveSite(sitesData[0]);
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching sites:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch sites'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const refreshSites = async () => {
    await fetchSites();
  };

  const value = {
    sites,
    activeSite,
    currentSite: activeSite,
    loading,
    error,
    setActiveSite,
    refreshSites
  };

  return (
    <SiteContext.Provider value={value}>
      {children}
    </SiteContext.Provider>
  );
};

export const useSiteContext = () => useContext(SiteContext);

export default SiteContext;
