
export interface OptimizationMetrics {
  timestamp: string;
  savings: number;
  co2Reduction: number;
  efficiencyGain: number;
  peakReduction: number;
  selfConsumption: number;
  targetMet: boolean;
  targetValue?: number;
  unit?: string;
}

export interface WeatherImpact {
  temperature: number;
  irradiance: number;
  cloud_cover: number;
  wind_speed: number;
  precipitation: number;
  humidity: number;
  cloudCover: number;
  forecast: {
    timestamp: string;
    temperature: number;
    cloudCover: number;
    precipitation: number;
  }[];
}

export interface OptimizationRecommendation {
  id: string;
  timestamp: string;
  category: string;
  title: string;
  description: string;
  potentialSavings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  implementationTime: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'implemented' | 'rejected';
}

export interface OptimizationAction {
  id: string;
  name: string;
  description: string;
  resourceType: string;
  resourceId: string;
  status: string;
  scheduledTime?: string;
  scheduledEndTime?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  impact: number;
  created_at: string;
  updated_at: string;
}

export interface OptimizationResult {
  id: string;
  timestamp: string;
  metrics: OptimizationMetrics;
  recommendations: OptimizationRecommendation[];
  actions: OptimizationAction[];
}

// Add OptimizationSettings interface
export interface OptimizationSettings {
  id: string;
  name: string;
  priority: 'cost' | 'emissions' | 'reliability' | 'balanced';
  objectives: {
    cost_reduction_target?: number;
    emission_reduction_target?: number;
    peak_shaving_target?: number;
    self_consumption_target?: number;
  };
  constraints: {
    battery_min_soc?: number;
    grid_feed_in_limit?: number;
    must_run_devices?: string[];
    time_of_use_preferences?: {
      start: string;
      end: string;
      priority: number;
    }[];
  };
  schedule: {
    active: boolean;
    frequency: 'hourly' | 'daily' | 'as_needed';
    time?: string;
  };
  status: 'active' | 'inactive' | 'draft';
  created_at: string;
  updated_at: string;
  site_id: string;
}
