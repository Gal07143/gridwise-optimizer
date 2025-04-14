
// Weather impact data structure
export interface WeatherImpact {
  temperature: number;
  irradiance: number;
  cloud_cover: number;
  wind_speed: number;
  precipitation: number;
}

// User behavior data for energy predictions
export interface UserBehavior {
  occupancy: number;
  activity_level: number;
  preferred_temperature: number;
  schedule: string[];
}

// Prediction result from ML models
export interface Prediction {
  timestamp: string;
  actual: number;
  predicted: number;
  confidence: number;
}

// Insight from ML analysis
export interface Insight {
  type: string;
  title: string;
  description: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  icon?: React.ReactNode;
}

// ML service interface
export interface MLService {
  initialize: () => Promise<void>;
  predict: (data: any[]) => Promise<Prediction[]>;
  generateInsights: (data: any[]) => Promise<Insight[]>;
  dispose: () => void;
}
