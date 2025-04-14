
// Basic telemetry data structure
export interface TelemetryData {
  id?: string;
  device_id: string;
  timestamp: Date | string;
  value: number;
  unit: string;
  parameter: string;
  [key: string]: any; // Allow additional fields
}

// Extended telemetry with additional analytics fields
export interface EnhancedTelemetry extends TelemetryData {
  trend?: 'rising' | 'falling' | 'stable';
  anomaly?: boolean;
  anomaly_score?: number;
  quality?: 'good' | 'uncertain' | 'bad';
  delta_value?: number;
  forecasted_value?: number;
}

// Batch of telemetry data for bulk operations
export interface TelemetryBatch {
  device_id: string;
  readings: TelemetryData[];
  batch_id?: string;
  timestamp?: string | Date;
}

// Aggregated telemetry for historical analysis
export interface AggregatedTelemetry {
  period_start: Date | string;
  period_end: Date | string;
  device_id: string;
  parameter: string;
  min_value: number;
  max_value: number;
  avg_value: number;
  total_value: number;
  count: number;
  unit: string;
}

// Telemetry query parameters
export interface TelemetryQueryParams {
  device_id?: string;
  parameter?: string | string[];
  start_date?: Date | string;
  end_date?: Date | string;
  limit?: number;
  offset?: number;
  sort?: 'asc' | 'desc';
  aggregation?: 'none' | 'hourly' | 'daily' | 'weekly' | 'monthly';
}

// Date range interface for consistency
export interface DateRange {
  from: Date;
  to: Date;
}
