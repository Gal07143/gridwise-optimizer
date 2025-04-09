
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
