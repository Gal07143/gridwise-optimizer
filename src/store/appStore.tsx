
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Site } from '@/types/energy';
import { fetchSites } from '@/services/supabase/supabaseService';

interface AppState {
  currentSite: Site | null;
  setCurrentSite: (site: Site | null) => void;
  dashboardView: 'overview' | 'energy' | 'devices' | 'analytics';
  setDashboardView: (view: 'overview' | 'energy' | 'devices' | 'analytics') => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSite, setCurrentSite] = useState<Site | null>(null);
  const [dashboardView, setDashboardView] = useState<'overview' | 'energy' | 'devices' | 'analytics'>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Load default site on startup
  useEffect(() => {
    const loadDefaultSite = async () => {
      try {
        const sites = await fetchSites();
        if (sites && sites.length > 0) {
          setCurrentSite(sites[0]);
        }
      } catch (error) {
        console.error('Error loading default site:', error);
      }
    };
    
    loadDefaultSite();
  }, []);

  return (
    <AppContext.Provider value={{
      currentSite,
      setCurrentSite,
      dashboardView,
      setDashboardView,
      sidebarOpen,
      setSidebarOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  
  return context;
};
