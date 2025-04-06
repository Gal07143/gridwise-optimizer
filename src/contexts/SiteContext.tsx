
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Site } from '@/types/site';
import mockSites from '@/services/sites/mockSites';
import { toast } from 'sonner';

interface SiteContextType {
  currentSite: Site | null;
  sites: Site[];
  loading: boolean;
  setCurrentSite: (site: Site) => void;
}

const SiteContext = createContext<SiteContextType>({
  currentSite: null,
  sites: [],
  loading: true,
  setCurrentSite: () => {},
});

export const useSite = () => useContext(SiteContext);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  // Load sites on mount
  useEffect(() => {
    const loadSites = async () => {
      try {
        // In a real app, this would be a fetch from your API
        const loadedSites = mockSites;
        
        setSites(loadedSites);
        
        // Set default site if available
        if (loadedSites.length > 0) {
          setCurrentSite(loadedSites[0]);
        }
      } catch (error) {
        console.error('Error loading sites:', error);
        toast.error('Failed to load sites');
      } finally {
        setLoading(false);
      }
    };

    loadSites();
  }, []);

  const contextValue: SiteContextType = {
    currentSite,
    sites,
    loading,
    setCurrentSite,
  };

  return (
    <SiteContext.Provider value={contextValue}>
      {children}
    </SiteContext.Provider>
  );
};
