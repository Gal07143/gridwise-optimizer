import React, { createContext, useState, useContext, useEffect } from 'react';
import { Site } from '@/types/site';
import { mockSites } from '@/services/sites/mockSites';

interface SiteContextType {
  sites: Site[];
  currentSite: Site | null;
  setCurrentSite: (site: Site | null) => void;
  isLoading: boolean;
  error: Error | null;
}

const SiteContext = createContext<SiteContextType>({
  sites: [],
  currentSite: null,
  setCurrentSite: () => {},
  isLoading: false,
  error: null
});

export const useSite = () => useContext(SiteContext);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadSites = async () => {
      try {
        setIsLoading(true);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setSites(mockSites);
        
        if (mockSites.length > 0 && !currentSite) {
          setCurrentSite(mockSites[0]);
        }
      } catch (err) {
        console.error('Failed to load sites:', err);
        setError(err instanceof Error ? err : new Error('Failed to load sites'));
      } finally {
        setIsLoading(false);
      }
    };

    loadSites();
  }, []);

  return (
    <SiteContext.Provider 
      value={{
        sites,
        currentSite,
        setCurrentSite,
        isLoading,
        error
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};
