
export interface Site {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  created_at?: string;
  updated_at?: string;
  status?: 'active' | 'inactive' | 'maintenance';
  owner?: string;
  area?: number;
  area_unit?: string;
}

// Add this alias type for compatibility with energy.ts
export type { Site as EnergySite };
