
import React, { createContext, useState, useContext, useEffect } from 'react';
import { Site, createEmptySite } from '@/types/energy';

// Mock data for sites
const mockSites: Site[] = [
  {
    id: 'site-1',
    name: 'Main Campus',
    location: 'New York',
    timezone: 'America/New_York',
    lat: 40.7128,
    lng: -74.0060,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'site-2',
    name: 'West Building',
    location: 'San Francisco',
    timezone: 'America/Los_Angeles',
    lat: 37.7749,
    lng: -122.4194,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

export interface SiteContextType {
  sites: Site[];
  currentSite: Site | null;
  setCurrentSite: (site: Site) => void;
  loading: boolean;
  addSite: (site: Partial<Site>) => Promise<Site>;
  updateSite: (id: string, site: Partial<Site>) => Promise<Site>;
  deleteSite: (id: string) => Promise<void>;
}

const SiteContext = createContext<SiteContextType>({
  sites: [],
  currentSite: null,
  setCurrentSite: () => {},
  loading: true,
  addSite: async () => createEmptySite() as Site,
  updateSite: async () => createEmptySite() as Site,
  deleteSite: async () => {},
});

export const SiteProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [sites, setSites] = useState<Site[]>(mockSites);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize with the first site
  useEffect(() => {
    if (sites.length > 0 && !currentSite) {
      setCurrentSite(sites[0]);
    }
    setLoading(false);
  }, [sites, currentSite]);

  const addSite = async (siteData: Partial<Site>): Promise<Site> => {
    const newSite: Site = {
      ...createEmptySite(),
      ...siteData,
      id: `site-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Site;
    
    setSites([...sites, newSite]);
    return newSite;
  };

  const updateSite = async (id: string, siteData: Partial<Site>): Promise<Site> => {
    const updatedSites = sites.map(site => 
      site.id === id 
        ? { ...site, ...siteData, updated_at: new Date().toISOString() } 
        : site
    );
    
    setSites(updatedSites);
    
    const updatedSite = updatedSites.find(site => site.id === id) as Site;
    if (currentSite?.id === id) {
      setCurrentSite(updatedSite);
    }
    
    return updatedSite;
  };

  const deleteSite = async (id: string): Promise<void> => {
    const updatedSites = sites.filter(site => site.id !== id);
    setSites(updatedSites);
    
    if (currentSite?.id === id && updatedSites.length > 0) {
      setCurrentSite(updatedSites[0]);
    } else if (updatedSites.length === 0) {
      setCurrentSite(null);
    }
  };

  return (
    <SiteContext.Provider 
      value={{ 
        sites, 
        currentSite, 
        setCurrentSite, 
        loading,
        addSite,
        updateSite,
        deleteSite
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

// Export the hook for easy use in components
export const useSite = () => useContext(SiteContext);

export default SiteContext;
