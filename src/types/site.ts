
export interface Site {
  id: string;
  name: string;
  location: string;
  timezone: string;
  lat?: number | null;
  lng?: number | null;
  created_at: string;
  updated_at: string;
  type: string;
  status: string;
  
  // Additional site properties
  address?: string;
  description?: string;
  energy_category?: string;
  building_type?: string;
  area?: number;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface SiteStats {
  total: number;
  active: number;
  inactive: number;
  maintenance: number;
}

export interface SiteWithDevices extends Site {
  devices: {
    total: number;
    online: number;
    offline: number;
    error: number;
  };
}

export interface SiteFormData {
  name: string;
  location: string;
  timezone: string;
  lat?: number | null;
  lng?: number | null;
  description?: string;
  type?: string;
  status?: string;
  address?: string;
  energy_category?: string;
  building_type?: string;
  area?: number;
  contact_person?: string;
  contact_phone?: string;
  contact_email?: string;
}
