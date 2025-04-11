
// Types for Edge AI module

// Input telemetry data structure
export interface TelemetryInput {
  timestamp: string;
  site_id: string;
  power_consumption: number;
  solar_production: number;
  battery_soc: number;
  grid_power: number;
  temperature: number;
}

// ML model metadata
export interface ModelMetadata {
  version: string;
  created_at: string;
  features: string[];
  output_labels?: string[];
}

// Prediction result from inference
export interface PredictionResult {
  prediction_id: string;
  site_id: string;
  timestamp: string;
  forecast_type: string;
  values: number[];
  confidence: number;
  model_version: string;
  created_at: string;
  is_synced: boolean;
}

// System configuration
export interface EdgeAIConfig {
  offlineModeEnabled: boolean;
  autoSyncInterval: number; // In milliseconds
  modelUpdateCheckInterval: number; // In milliseconds
  fallbackStrategy: 'queue' | 'local-only' | 'ignore';
}

// Default configuration
export const DEFAULT_CONFIG: EdgeAIConfig = {
  offlineModeEnabled: true,
  autoSyncInterval: 5 * 60 * 1000, // 5 minutes
  modelUpdateCheckInterval: 24 * 60 * 60 * 1000, // 24 hours
  fallbackStrategy: 'queue'
};
