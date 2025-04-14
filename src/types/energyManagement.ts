
export interface Asset {
  id: string;
  name: string;
  type: string;
  capacity: number;
  status: string;
  location: string;
  [key: string]: any;
}

export interface GridSignal {
  id: string;
  type: string;
  value: string;
  source: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
  details?: any;
}

export interface EnergyForecast {
  timestamp: string;
  generation_forecast: number;
  consumption_forecast: number;
  net_forecast: number;
  confidence: number;
}

export interface OptimizationPlan {
  id: string;
  name: string;
  description: string;
  assets: string[];
  schedule: OptimizationAction[];
  savings: number;
  created_at: string;
  status: 'active' | 'scheduled' | 'completed' | 'cancelled';
}

export interface OptimizationAction {
  asset_id: string;
  time_start: string;
  time_end: string;
  action: 'charge' | 'discharge' | 'curtail' | 'export' | 'import';
  power: number;
  reason: string;
}

export interface FeedinTariff {
  id: string;
  rate: number;
  start_time?: string;
  end_time?: string;
  date_effective: string;
  date_expiry?: string;
}
