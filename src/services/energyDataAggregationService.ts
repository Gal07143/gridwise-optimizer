import { Device, TelemetryData } from '@/types/device';
import { supabase } from './supabase';
import { MLService } from './mlService';

export interface AggregationConfig {
  interval: 'minute' | 'hour' | 'day' | 'week' | 'month';
  metrics: string[];
  devices: string[];
  startTime: Date;
  endTime: Date;
}

export interface AggregatedData {
  timestamp: Date;
  deviceId: string;
  metric: string;
  min: number;
  max: number;
  avg: number;
  sum: number;
  count: number;
  quality: string;
}

export interface AggregationResult {
  data: AggregatedData[];
  metadata: {
    interval: string;
    startTime: Date;
    endTime: Date;
    deviceCount: number;
    metricCount: number;
    totalPoints: number;
  };
}

export class EnergyDataAggregationService {
  private mlService: MLService;
  private isInitialized: boolean = false;
  private cache: Map<string, AggregatedData[]> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_CACHE_SIZE = 1000;

  constructor() {
    this.mlService = new MLService({
      modelPath: '/models/aggregation_anomaly.onnx',
      modelType: 'fault',
      inputShape: [100, 4],
      outputShape: [1, 3],
      featureNames: ['value', 'rate_of_change', 'variance', 'quality_score']
    });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize ML service
      await this.mlService.initialize();
      
      this.isInitialized = true;
      console.log('Energy Data Aggregation service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Energy Data Aggregation service:', error);
      throw new Error(`Failed to initialize Energy Data Aggregation service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async aggregateData(config: AggregationConfig): Promise<AggregationResult> {
    if (!this.isInitialized) {
      throw new Error('Energy Data Aggregation service not initialized');
    }

    try {
      // Check cache
      const cacheKey = this.getCacheKey(config);
      const cachedData = this.cache.get(cacheKey);
      if (cachedData) {
        return {
          data: cachedData,
          metadata: {
            interval: config.interval,
            startTime: config.startTime,
            endTime: config.endTime,
            deviceCount: config.devices.length,
            metricCount: config.metrics.length,
            totalPoints: cachedData.length
          }
        };
      }

      // Fetch raw data
      const { data: rawData, error } = await supabase
        .from('telemetry_data')
        .select('*')
        .in('deviceId', config.devices)
        .gte('timestamp', config.startTime.toISOString())
        .lte('timestamp', config.endTime.toISOString())
        .order('timestamp', { ascending: true });

      if (error) throw error;

      // Aggregate data
      const aggregatedData = this.aggregateRawData(rawData, config);

      // Store in cache
      this.cache.set(cacheKey, aggregatedData);

      // Clean cache if needed
      this.cleanCache();

      return {
        data: aggregatedData,
        metadata: {
          interval: config.interval,
          startTime: config.startTime,
          endTime: config.endTime,
          deviceCount: config.devices.length,
          metricCount: config.metrics.length,
          totalPoints: aggregatedData.length
        }
      };
    } catch (error) {
      console.error('Failed to aggregate data:', error);
      throw new Error(`Failed to aggregate data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private aggregateRawData(rawData: TelemetryData[], config: AggregationConfig): AggregatedData[] {
    const aggregatedData: AggregatedData[] = [];
    const intervalMs = this.getIntervalMs(config.interval);

    // Group data by device, metric, and time interval
    const groupedData = new Map<string, TelemetryData[]>();
    for (const data of rawData) {
      const intervalStart = new Date(Math.floor(data.timestamp.getTime() / intervalMs) * intervalMs);
      const key = `${data.deviceId}_${intervalStart.toISOString()}`;
      
      if (!groupedData.has(key)) {
        groupedData.set(key, []);
      }
      
      groupedData.get(key)!.push(data);
    }

    // Aggregate each group
    for (const [key, group] of groupedData.entries()) {
      const [deviceId, intervalStart] = key.split('_');
      
      // Calculate statistics
      const values = group.map(d => d.value);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      
      // Calculate quality
      const quality = this.calculateQuality(group);
      
      // Create aggregated data point
      aggregatedData.push({
        timestamp: new Date(intervalStart),
        deviceId,
        metric: group[0].metadata?.unit || 'unknown',
        min,
        max,
        avg,
        sum,
        count: values.length,
        quality
      });
    }

    return aggregatedData;
  }

  private getIntervalMs(interval: string): number {
    switch (interval) {
      case 'minute':
        return 60 * 1000;
      case 'hour':
        return 60 * 60 * 1000;
      case 'day':
        return 24 * 60 * 60 * 1000;
      case 'week':
        return 7 * 24 * 60 * 60 * 1000;
      case 'month':
        return 30 * 24 * 60 * 60 * 1000;
      default:
        return 60 * 1000; // Default to minute
    }
  }

  private calculateQuality(group: TelemetryData[]): string {
    // Count quality values
    const qualityCounts = new Map<string, number>();
    for (const data of group) {
      const quality = data.quality || 'unknown';
      qualityCounts.set(quality, (qualityCounts.get(quality) || 0) + 1);
    }

    // Find most common quality
    let maxCount = 0;
    let mostCommonQuality = 'unknown';
    for (const [quality, count] of qualityCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonQuality = quality;
      }
    }

    return mostCommonQuality;
  }

  private getCacheKey(config: AggregationConfig): string {
    return `${config.interval}_${config.devices.join(',')}_${config.metrics.join(',')}_${config.startTime.getTime()}_${config.endTime.getTime()}`;
  }

  private cleanCache(): void {
    // Remove oldest entries if cache is too large
    if (this.cache.size > this.MAX_CACHE_SIZE) {
      const entriesToRemove = this.cache.size - this.MAX_CACHE_SIZE;
      const keys = Array.from(this.cache.keys()).slice(0, entriesToRemove);
      for (const key of keys) {
        this.cache.delete(key);
      }
    }
  }

  async detectAnomalies(data: AggregatedData[]): Promise<void> {
    try {
      if (data.length < 10) return;

      // Prepare data for anomaly detection
      const features = data.map(d => ({
        value: d.avg,
        rate_of_change: 0, // Will be calculated
        variance: Math.pow(d.max - d.min, 2),
        quality_score: d.quality === 'good' ? 1 : 0
      }));

      // Calculate rate of change
      for (let i = 1; i < features.length; i++) {
        features[i].rate_of_change = features[i].value - features[i-1].value;
      }

      // Detect anomalies
      const result = await this.mlService.detectAnomalies({
        data: features
      } as any);

      // Log anomalies
      if (result.anomalyScore > 0.7) {
        console.log(`Anomaly detected in aggregated data: ${result.anomalyScore}`);
      }
    } catch (error) {
      console.error('Failed to detect anomalies:', error);
    }
  }

  async dispose(): Promise<void> {
    this.cache.clear();
    this.isInitialized = false;
  }
} 