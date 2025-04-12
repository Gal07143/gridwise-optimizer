import { Device, TelemetryData } from '@/types/device';
import { supabase } from './supabase';
import { MLService } from './mlService';

export interface ModbusConfig {
  host: string;
  port: number;
  slaveId: number;
  timeout: number;
  retryCount: number;
  retryDelay: number;
}

export interface ModbusPoint {
  id: string;
  name: string;
  address: number;
  registerType: 'coil' | 'discrete' | 'holding' | 'input';
  dataType: 'boolean' | 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'float64';
  byteOrder: 'big' | 'little';
  wordOrder: 'big' | 'little';
  scaleFactor: number;
  offset: number;
  unit: string;
  description: string;
}

export interface ModbusReading {
  pointId: string;
  timestamp: Date;
  value: number | boolean;
  quality: 'good' | 'bad' | 'uncertain';
}

export class ModbusService {
  private config: ModbusConfig;
  private points: Map<string, ModbusPoint> = new Map();
  private mlService: MLService;
  private isInitialized: boolean = false;
  private isRunning: boolean = false;
  private lastReadings: Map<string, ModbusReading[]> = new Map();
  private readonly MAX_HISTORY = 1000;

  constructor(config: ModbusConfig) {
    this.config = config;
    this.mlService = new MLService({
      modelPath: '/models/modbus_anomaly.onnx',
      modelType: 'fault',
      inputShape: [100, 5],
      outputShape: [1, 3],
      featureNames: ['value', 'rate_of_change', 'variance', 'quality', 'timestamp']
    });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Initialize ML service
      await this.mlService.initialize();
      
      // Load points from database
      await this.loadPoints();
      
      this.isInitialized = true;
      console.log('Modbus service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Modbus service:', error);
      throw new Error(`Failed to initialize Modbus service: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async startAcquisition(intervalMs: number = 1000): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Modbus service not initialized');
    }

    if (this.isRunning) {
      console.log('Modbus acquisition already running');
      return;
    }

    this.isRunning = true;
    console.log(`Starting Modbus acquisition with interval ${intervalMs}ms`);

    // Start acquisition loop
    this.acquisitionLoop(intervalMs);
  }

  async stopAcquisition(): Promise<void> {
    this.isRunning = false;
    console.log('Modbus acquisition stopped');
  }

  private async loadPoints(): Promise<void> {
    try {
      const { data, error } = await supabase
        .from('modbus_points')
        .select('*')
        .eq('device_id', this.config.slaveId);

      if (error) throw error;
      
      if (data) {
        this.points.clear();
        data.forEach(point => {
          this.points.set(point.id, point);
        });
      }
    } catch (error) {
      console.error('Failed to load Modbus points:', error);
      throw error;
    }
  }

  private async acquisitionLoop(intervalMs: number): Promise<void> {
    while (this.isRunning) {
      try {
        // Simulate Modbus reading (in a real implementation, this would use a Modbus library)
        const readings = await this.readPoints();
        
        // Process readings
        await this.processReadings(readings);
        
        // Store readings in database
        await this.storeReadings(readings);
        
        // Wait for next interval
        await new Promise(resolve => setTimeout(resolve, intervalMs));
      } catch (error) {
        console.error('Error in Modbus acquisition loop:', error);
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  private async readPoints(): Promise<ModbusReading[]> {
    // This is a simulation - in a real implementation, this would use a Modbus library
    const readings: ModbusReading[] = [];
    
    for (const [pointId, point] of this.points.entries()) {
      // Simulate reading value
      const value = this.simulateReading(point);
      
      readings.push({
        pointId,
        timestamp: new Date(),
        value,
        quality: 'good'
      });
    }
    
    return readings;
  }

  private simulateReading(point: ModbusPoint): number | boolean {
    // Simulate different data types
    switch (point.dataType) {
      case 'boolean':
        return Math.random() > 0.5;
      case 'int16':
        return Math.floor(Math.random() * 65536) - 32768;
      case 'uint16':
        return Math.floor(Math.random() * 65536);
      case 'int32':
        return Math.floor(Math.random() * 4294967296) - 2147483648;
      case 'uint32':
        return Math.floor(Math.random() * 4294967296);
      case 'float32':
        return Math.random() * 100;
      case 'float64':
        return Math.random() * 1000;
      default:
        return 0;
    }
  }

  private async processReadings(readings: ModbusReading[]): Promise<void> {
    // Update historical data
    for (const reading of readings) {
      if (!this.lastReadings.has(reading.pointId)) {
        this.lastReadings.set(reading.pointId, []);
      }
      
      const history = this.lastReadings.get(reading.pointId)!;
      history.push(reading);
      
      // Keep only the last MAX_HISTORY readings
      if (history.length > this.MAX_HISTORY) {
        history.shift();
      }
    }
    
    // Detect anomalies using ML
    await this.detectAnomalies(readings);
  }

  private async detectAnomalies(readings: ModbusReading[]): Promise<void> {
    for (const reading of readings) {
      const history = this.lastReadings.get(reading.pointId) || [];
      
      if (history.length < 10) continue;
      
      // Prepare data for anomaly detection
      const data = history.slice(-10).map(r => ({
        value: typeof r.value === 'number' ? r.value : (r.value ? 1 : 0),
        timestamp: r.timestamp.getTime()
      }));
      
      // Calculate rate of change
      const rateOfChange = data.length > 1 
        ? (data[data.length - 1].value - data[data.length - 2].value) / 
          (data[data.length - 1].timestamp - data[data.length - 2].timestamp)
        : 0;
      
      // Calculate variance
      const values = data.map(d => d.value);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
      
      // Detect anomaly
      const result = await this.mlService.detectAnomalies({
        data: [{
          value: data[data.length - 1].value,
          rate_of_change: rateOfChange,
          variance,
          quality: reading.quality === 'good' ? 1 : 0,
          timestamp: data[data.length - 1].timestamp
        }]
      } as any);
      
      // If anomaly detected, update quality
      if (result.anomalyScore > 0.7) {
        reading.quality = 'bad';
        console.log(`Anomaly detected for point ${reading.pointId}: ${result.anomalyScore}`);
      }
    }
  }

  private async storeReadings(readings: ModbusReading[]): Promise<void> {
    try {
      // Convert readings to telemetry data format
      const telemetryData: TelemetryData[] = readings.map(reading => ({
        id: `${reading.pointId}_${reading.timestamp.getTime()}`,
        deviceId: this.config.slaveId.toString(),
        timestamp: reading.timestamp,
        value: typeof reading.value === 'number' ? reading.value : (reading.value ? 1 : 0),
        quality: reading.quality,
        metadata: {
          pointId: reading.pointId,
          dataType: this.points.get(reading.pointId)?.dataType || 'unknown',
          unit: this.points.get(reading.pointId)?.unit || 'unknown'
        }
      }));
      
      // Store in database
      const { error } = await supabase
        .from('telemetry_data')
        .insert(telemetryData);
      
      if (error) throw error;
    } catch (error) {
      console.error('Failed to store Modbus readings:', error);
    }
  }

  async getPointHistory(pointId: string, limit: number = 100): Promise<ModbusReading[]> {
    return this.lastReadings.get(pointId)?.slice(-limit) || [];
  }

  async getPoints(): Promise<ModbusPoint[]> {
    return Array.from(this.points.values());
  }

  async getPoint(pointId: string): Promise<ModbusPoint | null> {
    return this.points.get(pointId) || null;
  }

  async dispose(): Promise<void> {
    await this.stopAcquisition();
    this.points.clear();
    this.lastReadings.clear();
    this.isInitialized = false;
  }
} 