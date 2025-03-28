
// Updated Site type with capacity property
export interface Site {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  timezone?: string;
  capacity?: number;        // Added to fix errors
  location: string;         // This is a string now, not an object
  lat?: number | null;      // Separate lat field
  lng?: number | null;      // Separate lng field
  created_at: string;
  updated_at: string;
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
}

// Added for compatibility with EditSite component
export interface SiteFormValues {
  name: string;
  location: string;
  timezone: string;
  lat?: number | null;
  lng?: number | null;
}
