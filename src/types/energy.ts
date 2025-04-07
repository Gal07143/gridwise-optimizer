
export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
  device_id?: string;
  site_id?: string;
  acknowledged: boolean;
  timestamp: string;
  alert_source?: string;
  ack_by?: string;
  ack_at?: string;
  alert_type?: string;
}

export interface EnergyConsumption {
  id: string;
  site_id: string;
  timestamp: string;
  value: number;
  unit: string;
}

export interface EnergyProduction {
  id: string;
  site_id: string;
  timestamp: string;
  value: number;
  unit: string;
  source: string;
}

export interface EnergyCost {
  id: string;
  site_id: string;
  timestamp: string;
  value: number;
  currency: string;
}

export interface EnergyEmission {
  id: string;
  site_id: string;
  timestamp: string;
  value: number;
  unit: string;
}
