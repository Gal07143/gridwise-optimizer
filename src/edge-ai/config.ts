
import path from 'path';
import * as fs from 'fs';

// Base directories
export const BASE_DIR = path.resolve(process.env.EDGE_AI_BASE_DIR || './edge-ai');
export const MODELS_DIR = path.join(BASE_DIR, 'models');
export const BUFFER_DIR = path.join(BASE_DIR, 'buffer');

// File paths
export const MODEL_PATH = path.join(MODELS_DIR, 'latest.onnx');
export const MODEL_META_PATH = path.join(MODELS_DIR, 'model-meta.json');
export const QUEUE_PATH = path.join(BUFFER_DIR, 'queued-results.json');

// Sync configuration
export const SYNC_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
export const MAX_RETRY_COUNT = 3;
export const RETRY_DELAY_MS = 5000; // 5 seconds

// Supabase configuration
export const SUPABASE_BUCKET = 'ai-models';
export const MODEL_OBJECT_PATH = 'ems/latest.onnx';
export const MODEL_META_OBJECT_PATH = 'ems/model-meta.json';
export const AI_PREDICTIONS_TABLE = 'ai_predictions';

// Ensure directories exist
export const ensureDirectories = (): void => {
  [MODELS_DIR, BUFFER_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Telemetry input shape (adjust according to your model's requirements)
export interface TelemetryInput {
  timestamp: string;
  site_id: string;
  power_consumption: number;
  solar_production?: number;
  battery_soc?: number;
  grid_power?: number;
  temperature?: number;
  [key: string]: any; // For additional telemetry data
}

// Prediction output shape
export interface PredictionOutput {
  timestamp: string;
  site_id: string;
  prediction_id: string;
  forecast_type: 'consumption' | 'production' | 'battery_usage' | 'optimization';
  values: number[];
  time_horizon: number; // in hours
  confidence: number;
  created_at: string;
  model_version: string;
  is_synced: boolean;
}

// Model metadata interface
export interface ModelMetadata {
  version: string;
  created_at: string;
  input_shape: number[];
  output_shape: number[];
  features: string[];
  description?: string;
  performance_metrics?: {
    mape?: number;
    rmse?: number;
    r2?: number;
  };
}
