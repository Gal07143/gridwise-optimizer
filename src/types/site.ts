
export interface Site {
  id: string;
  name: string;
  location: string;
  timezone: string;
  lat?: number;
  lng?: number;
  created_at: string;
  updated_at: string;
  type: string;
  status: string;
  address?: string;
  description?: string;
  energy_category?: string;
  building_type?: string;
  area?: number;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
}

export interface SiteCreateInput {
  name: string;
  location: string;
  timezone: string;
  type: string;
  status: string;
  description?: string;
  lat?: number;
  lng?: number;
}

export interface SiteUpdateInput {
  name?: string;
  location?: string;
  timezone?: string;
  type?: string;
  status?: string;
  description?: string;
  lat?: number;
  lng?: number;
}

export interface SiteSelectorProps {
  sites: Site[];
  setActiveSite: (site: Site) => void;
  currentSiteId?: string;
}

// Add the missing SiteFormData interface
export interface SiteFormData {
  name: string;
  location: string;
  timezone: string;
  type: string;
  status: string;
  description?: string;
  lat?: number;
  lng?: number;
}

// Export DateRange from site.ts since it's imported from here
export interface DateRange {
  from: Date;
  to: Date;
}
