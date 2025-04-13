
// Define site model
export interface Site {
  id: string;
  name: string;
  location: string;
  type: 'residential' | 'commercial' | 'industrial' | 'research' | 'other';
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance' | 'offline';
  createdAt: string;
  updatedAt: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timezone?: string;
  contacts?: SiteContact[];
  metadata?: Record<string, any>;
}

// Define site contact model
export interface SiteContact {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  primary: boolean;
}

// Define energy flow data
export interface EnergyFlow {
  timestamp: string;
  sources: {
    solar?: number;
    wind?: number;
    grid?: number;
    generator?: number;
    battery?: number;
    other?: number;
  };
  consumption: {
    building?: number;
    ev?: number;
    export?: number;
    other?: number;
  };
  storage: {
    batteryLevel?: number;
    batteryCapacity?: number;
    charging?: boolean;
    chargePower?: number;
    dischargePower?: number;
  };
}

// Define tariff data
export interface Tariff {
  id: string;
  name: string;
  provider: string;
  type: 'fixed' | 'time-of-use' | 'dynamic' | 'demand';
  currency: string;
  rates: TariffRate[];
  validFrom: string;
  validUntil?: string;
  siteId: string;
}

// Define tariff rate
export interface TariffRate {
  id: string;
  name?: string;
  price: number;
  unit: 'kWh' | 'kW' | 'day';
  timeStart?: string; // 24h format HH:MM
  timeEnd?: string; // 24h format HH:MM
  daysOfWeek?: number[]; // 0-6, 0 = Sunday
  months?: number[]; // 1-12
}
