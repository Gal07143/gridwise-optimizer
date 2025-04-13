
export interface MLServiceConfig {
  modelPath: string;
  inputShape: number[];
  outputShape: number[];
  featureNames: string[];
  modelType: string; // Required parameter
}

export interface WeatherImpact {
  temperature: number;
  irradiance: number;
  cloud_cover: number;
  wind_speed: number;
  precipitation: number;
}

export interface EnergyPrediction {
  timestamp: Date;
  consumption: number;
  generation: number;
  battery_level: number; // Changed from batteryLevel to battery_level
  net_demand: number;
}

export interface EnergyAction {
  type: "charge" | "discharge" | "grid_import" | "grid_export";
  value: number; // Use value instead of amount
  reason: string;
  savings: number; // Use savings instead of estimatedSavings
}

export interface Prediction {
  timestamp: string;
  actual: number;
  predicted: number;
  confidence: number;
}

export interface Insight {
  type: 'energy' | 'battery' | 'weather' | 'cost';
  title: string;
  description: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  icon?: React.ReactNode;
}

export interface MLService {
  initialize: () => Promise<void>;
  predict: (data: any[]) => Promise<Prediction[]>;
  generateInsights: (data: any[]) => Promise<Insight[]>;
  dispose: () => void; // Add dispose method
}
