
export interface Site {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  type: 'residential' | 'commercial' | 'industrial' | 'utility';
  status: 'active' | 'inactive' | 'maintenance' | 'planning';
  owner_id: string;
  created_at?: string;
  updated_at?: string;
  max_power?: number;
  annual_consumption?: number;
  grid_connection_type?: string;
}

export interface SiteStats {
  total_energy_generation: number;
  total_energy_consumption: number;
  peak_demand: number;
  carbon_saved: number;
  cost_savings: number;
  system_efficiency: number;
}

export interface SiteDevice {
  id: string;
  site_id: string;
  device_id: string;
  position?: {
    x: number;
    y: number;
  };
  created_at?: string;
  updated_at?: string;
}
