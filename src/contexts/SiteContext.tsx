
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Site } from '@/types/energy';
import { getAllSites } from '@/services/siteService';
import { getOrCreateDummySite } from '@/services/sites/siteService';

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
  
  // Fetch all available sites
  const { data: sites = [], isLoading, error } = useQuery({
    queryKey: ['sites'],
    queryFn: getAllSites,
  });

  // Set initial site when sites are loaded
  useEffect(() => {
    const initializeSite = async () => {
      // If we already have a current site, do nothing
      if (currentSite) return;
      
      // If we have sites from the query, use the first one
      if (sites.length > 0) {
        setCurrentSite(sites[0]);
        return;
      }
      
      // If no sites are available, try to get or create a default site
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

  // Store the last selected site in localStorage
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
