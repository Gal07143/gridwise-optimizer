
import { ReactNode } from 'react';

export interface Prediction {
  timestamp: string;
  actual: number;
  predicted: number;
  confidence: number;
}

export interface Insight {
  type: string;
  title: string;
  description: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
  icon: ReactNode | null;
}

export interface WeatherImpact {
  temperature: number;
  irradiance: number;
  cloud_cover: number;
  wind_speed: number;
  precipitation: number;
}

export interface MLServiceConfig {
  modelPath: string;
  inputShape: number[];
  outputShape: number[];
  featureNames: string[];
  modelType: 'regression' | 'classification' | 'timeseries';
}

export interface TelemetryData {
  timestamp: string;
  value: number;
  device: string;
  measurement: string;
  [key: string]: any;
}
