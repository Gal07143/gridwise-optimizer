
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  // New fields inspired by MyEMS
  description?: string;
  area?: number; // in square meters
  building_type?: string;
  energy_category?: string[];
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
  weather_station_id?: string;
  cost_center?: string;
  kpi_baseline?: {
    energy_consumption?: number;
    energy_cost?: number;
    carbon_emissions?: number;
  };
}

export interface SiteContextType {
  sites: Site[];
  activeSite: Site | null;
  isLoading: boolean;
  error: Error | null;
  setSites: (sites: Site[]) => void;
  setActiveSite: (site: Site | null) => void;
  addSite: (site: Omit<Site, 'id' | 'created_at' | 'updated_at'>) => Promise<Site | null>;
  updateSite: (id: string, site: Partial<Site>) => Promise<Site | null>;
  deleteSite: (id: string) => Promise<boolean>;
  refreshSites: () => Promise<void>;
}

// Create context with default values
const SiteContext = createContext<SiteContextType>({
  sites: [],
  activeSite: null,
  isLoading: true,
  error: null,
  setSites: () => {},
  setActiveSite: () => {},
  addSite: async () => null,
  updateSite: async () => null,
  deleteSite: async () => false,
  refreshSites: async () => {},
});

export const useSiteContext = () => useContext(SiteContext);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [activeSite, setActiveSite] = useState<Site | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch sites from Supabase or fallback to mock data
  const fetchSites = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Try to fetch from Supabase if connected
      try {
        const { data, error } = await supabase
          .from('sites')
          .select('*')
          .order('name');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Transform data to match our Site interface if needed
          const formattedSites = data.map(site => ({
            ...site,
            location: site.lat && site.lng 
              ? { latitude: site.lat, longitude: site.lng } 
              : undefined
          }));
          
          setSites(formattedSites);
          
          // Set first site as active if none selected
          if (!activeSite && formattedSites.length > 0) {
            setActiveSite(formattedSites[0]);
          }
          
          return;
        }
      } catch (e) {
        console.warn('Supabase fetch failed, using mock data:', e);
      }
      
      // Fallback to mock data
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
          description: 'Main solar power generation facility',
          area: 10000,
          building_type: 'Industrial',
          energy_category: ['solar', 'battery'],
          contact_person: 'John Doe',
          contact_phone: '555-123-4567',
          contact_email: 'john@example.com',
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
          description: 'Northern wind turbine farm',
          area: 25000,
          building_type: 'Wind Farm',
          energy_category: ['wind'],
          contact_person: 'Jane Smith',
          contact_phone: '555-987-6543',
          contact_email: 'jane@example.com',
        },
      ];

      setSites(mockSites);
      if (!activeSite && mockSites.length > 0) {
        setActiveSite(mockSites[0]);
      }
      
    } catch (err) {
      console.error('Error fetching sites:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch sites'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  // Add a new site
  const addSite = async (siteData: Omit<Site, 'id' | 'created_at' | 'updated_at'>): Promise<Site | null> => {
    try {
      // Try to add site to Supabase if connected
      try {
        const { data, error } = await supabase
          .from('sites')
          .insert([{
            name: siteData.name,
            location: siteData.address,
            timezone: siteData.timezone || 'UTC',
            lat: siteData.location?.latitude,
            lng: siteData.location?.longitude,
            // Add other fields as needed
          }])
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Format the returned site data
          const newSite: Site = {
            ...data[0],
            location: data[0].lat && data[0].lng 
              ? { latitude: data[0].lat, longitude: data[0].lng } 
              : undefined
          };
          
          setSites(prev => [...prev, newSite]);
          toast.success('Site added successfully');
          return newSite;
        }
      } catch (e) {
        console.warn('Supabase add failed, using mock implementation:', e);
      }
      
      // Fallback to mock implementation
      const newSite: Site = {
        id: `mock-${Date.now()}`,
        ...siteData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      setSites(prev => [...prev, newSite]);
      toast.success('Site added successfully (mock)');
      return newSite;
      
    } catch (err) {
      console.error('Error adding site:', err);
      toast.error('Failed to add site');
      return null;
    }
  };

  // Update an existing site
  const updateSite = async (id: string, siteData: Partial<Site>): Promise<Site | null> => {
    try {
      // Try to update site in Supabase if connected
      try {
        const { data, error } = await supabase
          .from('sites')
          .update({
            name: siteData.name,
            location: siteData.address,
            timezone: siteData.timezone,
            lat: siteData.location?.latitude,
            lng: siteData.location?.longitude,
            // Add other fields as needed
          })
          .eq('id', id)
          .select();
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Format the returned site data
          const updatedSite: Site = {
            ...data[0],
            location: data[0].lat && data[0].lng 
              ? { latitude: data[0].lat, longitude: data[0].lng } 
              : undefined
          };
          
          setSites(prev => prev.map(site => site.id === id ? updatedSite : site));
          
          // Update active site if it's the one being updated
          if (activeSite?.id === id) {
            setActiveSite(updatedSite);
          }
          
          toast.success('Site updated successfully');
          return updatedSite;
        }
      } catch (e) {
        console.warn('Supabase update failed, using mock implementation:', e);
      }
      
      // Fallback to mock implementation
      const updatedSite: Site = {
        ...sites.find(site => site.id === id) as Site,
        ...siteData,
        updated_at: new Date().toISOString(),
      };
      
      setSites(prev => prev.map(site => site.id === id ? updatedSite : site));
      
      // Update active site if it's the one being updated
      if (activeSite?.id === id) {
        setActiveSite(updatedSite);
      }
      
      toast.success('Site updated successfully (mock)');
      return updatedSite;
      
    } catch (err) {
      console.error('Error updating site:', err);
      toast.error('Failed to update site');
      return null;
    }
  };

  // Delete a site
  const deleteSite = async (id: string): Promise<boolean> => {
    try {
      // Try to delete site from Supabase if connected
      try {
        const { error } = await supabase
          .from('sites')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
      } catch (e) {
        console.warn('Supabase delete failed, using mock implementation:', e);
      }
      
      // Update local state regardless
      setSites(prev => prev.filter(site => site.id !== id));
      
      // If active site is deleted, set another one as active
      if (activeSite?.id === id) {
        const remainingSites = sites.filter(site => site.id !== id);
        setActiveSite(remainingSites.length > 0 ? remainingSites[0] : null);
      }
      
      toast.success('Site deleted successfully');
      return true;
      
    } catch (err) {
      console.error('Error deleting site:', err);
      toast.error('Failed to delete site');
      return false;
    }
  };

  // Refresh sites data
  const refreshSites = async (): Promise<void> => {
    await fetchSites();
  };

  return (
    <SiteContext.Provider value={{ 
      sites, 
      activeSite, 
      isLoading, 
      error, 
      setSites, 
      setActiveSite,
      addSite,
      updateSite,
      deleteSite,
      refreshSites
    }}>
      {children}
    </SiteContext.Provider>
  );
};

export default SiteProvider;
