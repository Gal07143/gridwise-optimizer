
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export interface Site {
  id: string;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  capacity?: number;
  type?: string;
  status?: string;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SiteContextType {
  sites: Site[];
  currentSite: Site | null;
  setCurrentSite: (site: Site) => void;
  isLoading: boolean;
  error: string | null;
}

const SiteContext = createContext<SiteContextType>({
  sites: [],
  currentSite: null,
  setCurrentSite: () => {},
  isLoading: false,
  error: null,
});

export const useSite = () => useContext(SiteContext);

// Also export as useSiteContext for components that expect this name
export const useSiteContext = () => useContext(SiteContext);

// Mock data for sites
const mockSites: Site[] = [
  {
    id: '1',
    name: 'Main Residence',
    address: '123 Energy St',
    city: 'Solar City',
    country: 'USA',
    capacity: 10.5,
    type: 'residential',
    status: 'active',
    timezone: 'America/Los_Angeles',
    created_at: '2023-01-15T08:00:00Z',
    updated_at: '2023-04-10T15:30:00Z'
  },
  {
    id: '2',
    name: 'Beach House',
    address: '456 Coastal Ave',
    city: 'Seaside',
    country: 'USA',
    capacity: 7.2,
    type: 'residential',
    status: 'active',
    timezone: 'America/New_York',
    created_at: '2023-02-20T10:15:00Z',
    updated_at: '2023-05-05T09:45:00Z'
  },
  {
    id: '3',
    name: 'Mountain Cabin',
    address: '789 Ridge Road',
    city: 'Alpine',
    country: 'USA',
    capacity: 5.8,
    type: 'residential',
    status: 'maintenance',
    timezone: 'America/Denver',
    created_at: '2023-03-10T14:30:00Z',
    updated_at: '2023-06-01T16:20:00Z'
  }
];

export const SiteProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API fetch
    const fetchSites = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Set mock data
        setSites(mockSites);
        setCurrentSite(mockSites[0]);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch sites');
        setIsLoading(false);
      }
    };

    fetchSites();
  }, []);

  return (
    <SiteContext.Provider value={{ sites, currentSite, setCurrentSite, isLoading, error }}>
      {children}
    </SiteContext.Provider>
  );
};
