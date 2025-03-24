
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

// Define site interface
interface Site {
  id: string;
  name: string;
  location: string;
  timezone: string;
  lat?: number;
  lng?: number;
  created_at?: string;
  updated_at?: string;
}

interface SiteContextType {
  sites: Site[];
  currentSite: Site | null;
  loading: boolean;
  error: Error | null;
  fetchSites: () => Promise<void>;
  setCurrentSiteById: (id: string) => void;
  createSite: (site: Omit<Site, 'id' | 'created_at' | 'updated_at'>) => Promise<Site | null>;
  updateSite: (id: string, updates: Partial<Site>) => Promise<Site | null>;
  deleteSite: (id: string) => Promise<boolean>;
}

const SiteContext = createContext<SiteContextType>({} as SiteContextType);

export const useSite = () => {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error('useSite must be used within a SiteProvider');
  }
  return context;
};

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sites, setSites] = useState<Site[]>([]);
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  // Fetch sites when the user changes
  useEffect(() => {
    if (user) {
      fetchSites();
    } else {
      setSites([]);
      setCurrentSite(null);
    }
  }, [user]);

  // Fetch all sites the user has access to
  const fetchSites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Fetch sites
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setSites(data || []);

      // Set the current site if none is selected and sites exist
      if (!currentSite && data && data.length > 0) {
        setCurrentSite(data[0]);
      }
    } catch (err) {
      console.error('Error fetching sites:', err);
      setError(err as Error);
      toast.error('Failed to load sites', {
        description: (err as Error).message
      });
    } finally {
      setLoading(false);
    }
  };

  // Set the current site by ID
  const setCurrentSiteById = (id: string) => {
    const site = sites.find(s => s.id === id);
    if (site) {
      setCurrentSite(site);
      localStorage.setItem('currentSiteId', id);
    }
  };

  // Create a new site
  const createSite = async (site: Omit<Site, 'id' | 'created_at' | 'updated_at'>): Promise<Site | null> => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('sites')
        .insert([site])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update the sites list
      setSites(prev => [...prev, data]);
      toast.success('Site created successfully');
      
      return data;
    } catch (err) {
      console.error('Error creating site:', err);
      setError(err as Error);
      toast.error('Failed to create site', {
        description: (err as Error).message
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update a site
  const updateSite = async (id: string, updates: Partial<Site>): Promise<Site | null> => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('sites')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Update the sites list
      setSites(prev => prev.map(site => site.id === id ? { ...site, ...updates } : site));
      
      // Update the current site if it's the one being updated
      if (currentSite && currentSite.id === id) {
        setCurrentSite({ ...currentSite, ...updates });
      }

      toast.success('Site updated successfully');
      return data;
    } catch (err) {
      console.error('Error updating site:', err);
      setError(err as Error);
      toast.error('Failed to update site', {
        description: (err as Error).message
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Delete a site
  const deleteSite = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Remove from the sites list
      setSites(prev => prev.filter(site => site.id !== id));
      
      // If the current site is deleted, select a different one
      if (currentSite && currentSite.id === id) {
        const newSites = sites.filter(site => site.id !== id);
        setCurrentSite(newSites.length > 0 ? newSites[0] : null);
      }

      toast.success('Site deleted successfully');
      return true;
    } catch (err) {
      console.error('Error deleting site:', err);
      setError(err as Error);
      toast.error('Failed to delete site', {
        description: (err as Error).message
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteContext.Provider value={{
      sites,
      currentSite,
      loading,
      error,
      fetchSites,
      setCurrentSiteById,
      createSite,
      updateSite,
      deleteSite
    }}>
      {children}
    </SiteContext.Provider>
  );
};
