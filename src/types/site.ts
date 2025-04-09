export interface Site {
  id: string;
  name: string;
  location: string;
  description?: string;
  timezone: string;
  created_at?: string;
  updated_at?: string;
  lat?: number;
  lng?: number;
  type?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  city?: string;
  state?: string;
  country?: string;
  address?: string;
  postal_code?: string;
  site_type?: string;
  building_type?: string;
  area?: number;
  tags?: string[] | Record<string, any>;
  main_image_url?: string;
  organization_id?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
}

export interface SiteConfig {
  id?: string;
  name: string;
  location: string;
  description?: string;
  timezone: string;
  lat?: number;
  lng?: number;
  type?: string;
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface SiteMetrics {
  totalConsumption: number;
  totalProduction: number;
  totalSavings: number;
  peakDemand: number;
  co2Saved: number;
  devices: number;
}

export interface SiteSummary extends Site {
  metrics?: SiteMetrics;
  deviceCount?: number;
  alertCount?: number;
}

export interface SiteFormData {
  name: string;
  location: string;
  description?: string;
  timezone: string;
  lat?: number;
  lng?: number;
  type?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  site_type?: string;
  contact_person?: string;
  contact_email?: string;
  contact_phone?: string;
  tags?: string[] | Record<string, any>;
}

export interface DateRange {
  from: Date;
  to: Date;
}
