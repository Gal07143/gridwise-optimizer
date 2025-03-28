
// Types for the site management functionality
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
  // Enhanced fields inspired by MyEMS
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
  // Additional new fields
  site_code?: string;
  owner?: string;
  construction_year?: number;
  renovation_year?: number;
  property_value?: number;
  property_currency?: string;
  energy_certificates?: string[];
  operating_hours?: {
    weekdays?: { start: string; end: string; };
    weekends?: { start: string; end: string; };
    holidays?: { start: string; end: string; };
  };
  photo_url?: string;
  custom_fields?: Record<string, any>;
  lat?: number; // For compatibility with Supabase
  lng?: number; // For compatibility with Supabase
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
