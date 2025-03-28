
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  fetchSites, 
  addSiteToDb, 
  updateSiteInDb, 
  deleteSiteFromDb 
} from '@/services/sites/siteService';
import { SiteContextType, Site } from '@/types/site';

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

  useEffect(() => {
    const loadSites = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const loadedSites = await fetchSites();
        setSites(loadedSites);
        
        // Set first site as active if none selected
        if (!activeSite && loadedSites.length > 0) {
          setActiveSite(loadedSites[0]);
        }
      } catch (err) {
        console.error('Error loading sites:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch sites'));
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSites();
    
    // Set up realtime subscription
    const subscription = supabase
      .channel('sites-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'sites' 
      }, (payload) => {
        console.log('Received realtime update:', payload);
        refreshSites();
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Add a new site
  const addSite = async (siteData: Omit<Site, 'id' | 'created_at' | 'updated_at'>): Promise<Site | null> => {
    try {
      const newSite = await addSiteToDb(siteData);
      if (newSite) {
        setSites(prev => [...prev, newSite]);
        toast.success('Site added successfully');
        return newSite;
      }
      return null;
    } catch (err) {
      console.error('Error adding site:', err);
      toast.error('Failed to add site');
      return null;
    }
  };

  // Update an existing site
  const updateSite = async (id: string, siteData: Partial<Site>): Promise<Site | null> => {
    try {
      const updatedSite = await updateSiteInDb(id, siteData);
      if (updatedSite) {
        setSites(prev => prev.map(site => site.id === id ? updatedSite : site));
        
        // Update active site if it's the one being updated
        if (activeSite?.id === id) {
          setActiveSite(updatedSite);
        }
        
        toast.success('Site updated successfully');
        return updatedSite;
      }
      return null;
    } catch (err) {
      console.error('Error updating site:', err);
      toast.error('Failed to update site');
      return null;
    }
  };

  // Delete a site
  const deleteSite = async (id: string): Promise<boolean> => {
    try {
      const success = await deleteSiteFromDb(id);
      if (success) {
        setSites(prev => prev.filter(site => site.id !== id));
        
        // If active site is deleted, set another one as active
        if (activeSite?.id === id) {
          const remainingSites = sites.filter(site => site.id !== id);
          setActiveSite(remainingSites.length > 0 ? remainingSites[0] : null);
        }
        
        toast.success('Site deleted successfully');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error deleting site:', err);
      toast.error('Failed to delete site');
      return false;
    }
  };

  // Refresh sites data
  const refreshSites = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const refreshedSites = await fetchSites();
      setSites(refreshedSites);
      
      // If active site was updated or deleted, update it
      if (activeSite) {
        const updatedActiveSite = refreshedSites.find(site => site.id === activeSite.id);
        if (updatedActiveSite) {
          setActiveSite(updatedActiveSite);
        } else if (refreshedSites.length > 0) {
          // If active site no longer exists, set first available site as active
          setActiveSite(refreshedSites[0]);
        } else {
          setActiveSite(null);
        }
      }
    } catch (err) {
      console.error('Error refreshing sites:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh sites'));
    } finally {
      setIsLoading(false);
    }
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
