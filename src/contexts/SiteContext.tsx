
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Site {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  timezone?: string;
  capacity?: number;
  location?: {
    latitude: number;
    longitude: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface SiteContextType {
  sites: Site[];
  activeSite: Site | null;
  isLoading: boolean;
  error: Error | null;
  setSites: (sites: Site[]) => void;
  setActiveSite: (site: Site | null) => void;
}

// Create context with default values
const SiteContext = createContext<SiteContextType>({
  sites: [],
  activeSite: null,
  isLoading: true,
  error: null,
  setSites: () => {},
  setActiveSite: () => {},
});

export const useSiteContext = () => useContext(SiteContext);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [activeSite, setActiveSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulated data for sites
    const mockSites: Site[] = [
      {
        id: '1',
        name: 'Main Solar Plant',
        address: '123 Energy St',
        city: 'Sunnyvale',
        state: 'CA',
        country: 'USA',
        zipCode: '94086',
        timezone: 'America/Los_Angeles',
        capacity: 500,
        location: { latitude: 37.368, longitude: -122.036 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Wind Farm North',
        address: '456 Turbine Rd',
        city: 'Windy Hills',
        state: 'TX',
        country: 'USA',
        zipCode: '75001',
        timezone: 'America/Chicago',
        capacity: 750,
        location: { latitude: 32.77, longitude: -96.79 },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    setSites(mockSites);
    setActiveSite(mockSites[0]);
    setIsLoading(false);
  }, []);

  return (
    <SiteContext.Provider value={{ sites, activeSite, isLoading, error, setSites, setActiveSite }}>
      {children}
    </SiteContext.Provider>
  );
};

export default SiteProvider;
