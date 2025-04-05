
export interface Site {
  id: string;
  name: string;
  location: string;
  type: string;
  status: string;
  timezone: string;
  lat?: number;
  lng?: number;
  devices?: number;
  lastUpdated?: string;
  created_at: string;
  updated_at: string;
  address?: string;
  description?: string;
  building_type?: string;
  area?: number;
  energy_category?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
}

export interface SiteFormData {
  name: string;
  location: string;
  type: string;
  timezone?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  description?: string;
  building_type?: string;
  area?: number;
  energy_category?: string;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
}

export interface SiteStats {
  totalEnergy: number;
  currentPower: number;
  peakPower: number;
  savings: number;
  carbonOffset: number;
}

export interface SiteSettings {
  site_id: string;
  name: string;
  enable_alerts: boolean;
  alert_email?: string;
  alert_phone?: string;
  maintenance_mode: boolean;
  timezone: string;
  currency: string;
  energy_rate?: number;
  feed_in_tariff?: number;
  primary_color?: string;
  logo_url?: string;
}

export interface SiteSummary {
  id: string;
  name: string;
  location: string;
  type: string;
  status: string;
  device_count: number;
  last_updated?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}
