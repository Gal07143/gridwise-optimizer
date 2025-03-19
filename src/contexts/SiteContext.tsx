import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Site } from '@/types/energy';
import { getAllSites, getOrCreateDummySite } from '@/services/sites/siteService';

interface SiteContextType {
  currentSite: Site | null;
  sites: Site[];
  isLoading: boolean;
  error: Error | null;
  setCurrentSite: (site: Site) => void;
}

const SiteContext = createContext<SiteContextType | undefined>(undefined);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  
  const { data: sites = [], isLoading, error } = useQuery({
    queryKey: ['sites'],
    queryFn: () => getAllSites(),
  });

  useEffect(() => {
    const initializeSite = async () => {
      if (currentSite) return;
      
      if (sites.length > 0) {
        setCurrentSite(sites[0]);
        return;
      }
      
      try {
        const defaultSite = await getOrCreateDummySite();
        if (defaultSite) {
          setCurrentSite(defaultSite);
        }
      } catch (err) {
        console.error("Failed to initialize default site:", err);
      }
    };

    initializeSite();
  }, [sites, currentSite]);

  useEffect(() => {
    if (currentSite) {
      localStorage.setItem('lastSelectedSiteId', currentSite.id);
    }
  }, [currentSite]);

  return (
    <SiteContext.Provider
      value={{
        currentSite,
        sites,
        isLoading,
        error: error as Error | null,
        setCurrentSite,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export const useSite = (): SiteContextType => {
  const context = useContext(SiteContext);
  if (context === undefined) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};
