
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

// Add missing constants for syncAgent
export const MODELS_DIR = './models';
export const MODEL_PATH = `${MODELS_DIR}/model.onnx`;
export const MODEL_META_PATH = `${MODELS_DIR}/metadata.json`;
export const SUPABASE_BUCKET = 'ai-models';
export const MODEL_OBJECT_PATH = 'edge/energy-forecast/model.onnx';
export const MODEL_META_OBJECT_PATH = 'edge/energy-forecast/metadata.json';
export const SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
export const MAX_RETRY_COUNT = 3;
export const RETRY_DELAY_MS = 30 * 1000; // 30 seconds

// Helper function to ensure directories exist
export const ensureDirectories = () => {
  // This is a placeholder for node.js fs functionality
  // In a browser environment, this would need to be modified
  console.log('Ensuring directories exist for model storage');
  // In real implementation, would use fs.mkdirSync(MODELS_DIR, { recursive: true })
};
