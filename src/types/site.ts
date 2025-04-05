
export interface Site {
  id: string;
  name: string;
  location: string;
  type: string;
  status: string;
  devices?: number;
  lastUpdated?: string;
  created_at: string;
  updated_at: string;
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
