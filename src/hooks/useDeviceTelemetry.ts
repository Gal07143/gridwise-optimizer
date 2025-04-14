import { useState, useEffect, useCallback, useRef } from 'react';
import { TelemetryData } from '@/types/telemetry';
import { Device } from '@/types/device';
import { MLService, MLServiceConfig } from '@/services/mlService';

// Circular buffer for efficient telemetry storage
class TelemetryBuffer<T> {
  private buffer: T[];
  private head: number = 0;
  private size: number = 0;
  
  constructor(private capacity: number) {
    this.buffer = new Array(capacity);
  }

  push(item: T): void {
    this.buffer[this.head] = item;
    this.head = (this.head + 1) % this.capacity;
    this.size = Math.min(this.size + 1, this.capacity);
  }

  getItems(): T[] {
    const items: T[] = [];
    const start = (this.head - this.size + this.capacity) % this.capacity;
    for (let i = 0; i < this.size; i++) {
      items.push(this.buffer[(start + i) % this.capacity]);
    }
    return items;
  }

  clear(): void {
    this.head = 0;
    this.size = 0;
  }
}

// Tree structure for hierarchical device data
interface DeviceNode {
  device: Device;
  telemetry: TelemetryBuffer<TelemetryData>;
  children: Map<string, DeviceNode>;
  parent?: DeviceNode;
  predictions?: {
    energyConsumption: number[];
    batteryHealth: number;
    maintenanceNeeded: boolean;
    nextMaintenanceDate?: Date;
  };
}

export interface DeviceTelemetryState {
  telemetry: TelemetryData[];
  predictions: {
    energyConsumption: number[];
    batteryHealth: number;
    maintenanceNeeded: boolean;
    nextMaintenanceDate?: Date;
  };
  anomalies: {
    score: number;
    details: string[];
  };
  isLoading: boolean;
  error: Error | null;
}

export function useDeviceTelemetry(device: Device) {
  const [state, setState] = useState<DeviceTelemetryState>({
    telemetry: [],
    predictions: {
      energyConsumption: [],
      batteryHealth: 100,
      maintenanceNeeded: false
    },
    anomalies: {
      score: 0,
      details: []
    },
    isLoading: false,
    error: null
  });

  // Use refs for ML services to persist between renders
  const mlServices = useRef({
    energy: new MLService({
      modelPath: '/models/energy_model.onnx',
      inputShape: [24, 7], // 24 hours of data, 7 features
      outputShape: [24, 1], // 24 hour prediction
      featureNames: ['consumption', 'generation', 'battery_level', 'temperature', 'time_of_day', 'day_of_week', 'is_holiday'],
      modelType: 'onnx' // Added required modelType
    }),
    battery: new MLService({
      modelPath: '/models/battery_health_model.onnx',
      inputShape: [30, 5], // 30 days of data, 5 features
      outputShape: [1, 3], // health score, degradation rate, days until maintenance
      featureNames: ['cycles', 'depth_of_discharge', 'temperature', 'charge_rate', 'discharge_rate'],
      modelType: 'onnx' // Added required modelType
    })
  });

  // Telemetry buffer for efficient storage
  const telemetryBuffer = useRef(new TelemetryBuffer<TelemetryData>(1000));

  const processTelemetry = useCallback(async (newData: TelemetryData) => {
    try {
      telemetryBuffer.current.push(newData);
      const recentData = telemetryBuffer.current.getItems();

      // Initialize ML models if needed
      await Promise.all([
        mlServices.current.energy.initialize(),
        mlServices.current.battery.initialize()
      ]);

      // Get energy predictions
      const energyPredictions = await mlServices.current.energy.predictBehavior(recentData, 24);

      // Get battery health analysis
      const batteryHealth = await mlServices.current.battery.detectAnomalies(recentData);

      // Update state with new predictions
      setState(prev => ({
        ...prev,
        telemetry: recentData,
        predictions: {
          energyConsumption: energyPredictions,
          batteryHealth: batteryHealth.prediction,
          maintenanceNeeded: batteryHealth.anomalyScore > 0.7,
          nextMaintenanceDate: batteryHealth.anomalyScore > 0.7 
            ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
            : undefined
        },
        anomalies: {
          score: batteryHealth.anomalyScore,
          details: getAnomalyDetails(batteryHealth)
        }
      }));
    } catch (error) {
      console.error('Error processing telemetry:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error : new Error('Unknown error occurred')
      }));
    }
  }, []);

  // Cleanup function
  useEffect(() => {
    return () => {
      mlServices.current.energy.dispose();
      mlServices.current.battery.dispose();
      telemetryBuffer.current.clear();
    };
  }, []);

  const getAnomalyDetails = (batteryHealth: { anomalyScore: number; prediction: number; confidence: number }) => {
    const details: string[] = [];
    
    if (batteryHealth.anomalyScore > 0.7) {
      if (batteryHealth.prediction < 70) {
        details.push('Battery health is degrading faster than expected');
      }
      if (batteryHealth.confidence < 0.8) {
        details.push('Unusual battery behavior detected');
      }
    }
    
    return details;
  };

  return {
    ...state,
    processTelemetry
  };
}
