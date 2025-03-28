
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Site } from '@/types/energy';
import { getSites } from '@/services/sites/siteService';

interface SiteContextType {
  sites: Site[];
  activeSite: Site | null;
  loading: boolean;
  error: Error | null;
  setSites: (sites: Site[]) => void;
  setActiveSite: (site: Site | null) => void;
  refreshSites: () => Promise<void>;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const useSiteContext = () => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSiteContext must be used within a SiteProvider');
  }
  return context;
};

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    loading,
    error,
    setSites,
    setActiveSite,
    refreshSites
  };

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};

export default SiteContext;
