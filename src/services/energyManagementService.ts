import { supabase } from './supabase';
import { Asset, GridSignal, EnergyData } from '../types/energyManagement';
import { MLService } from './mlService';
import { Device, TelemetryData } from '@/types/device';

export interface EnergyPrediction {
  timestamp: string;
  consumption: number;
  generation: number;
  battery_level: number;
  grid_import: number;
  grid_export: number;
  confidence: number;
}

export interface BatteryHealth {
  state_of_health: number;
  state_of_charge: number;
  temperature: number;
  cycle_count: number;
  remaining_life: number;
  health_status: 'good' | 'warning' | 'critical';
}

export interface EnergyAction {
  type: 'charge' | 'discharge' | 'grid_import' | 'grid_export';
  power: number;
  duration: number;
  priority: number;
  reason: string;
}

export interface WeatherImpact {
  temperature: number;
  irradiance: number;
  cloud_cover: number;
  wind_speed: number;
  precipitation: number;
}

export interface UserBehavior {
  occupancy: boolean;
  activity_level: number;
  preferred_temperature: number;
  schedule: {
    wake_up: string;
    leave_home: string;
    return_home: string;
    sleep: string;
  };
}

export interface SystemFaults {
  device_id: string;
  fault_type: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
  description: string;
}

export interface CostOptimization {
  tariff_type: string;
  peak_rate: number;
  off_peak_rate: number;
  export_rate: number;
  daily_charges: number;
}

export const energyManagementService = {
    // Asset Management
    async getAssets(): Promise<Asset[]> {
        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .order('name');
        
        if (error) throw error;
        return data || [];
    },

    async getAsset(id: string): Promise<Asset> {
        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    },

    async createAsset(asset: Omit<Asset, 'id'>): Promise<Asset> {
        const { data, error } = await supabase
            .from('assets')
            .insert(asset)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async updateAsset(id: string, asset: Partial<Asset>): Promise<Asset> {
        const { data, error } = await supabase
            .from('assets')
            .update(asset)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    async deleteAsset(id: string): Promise<void> {
        const { error } = await supabase
            .from('assets')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
    },

    // Grid Signals
    async getGridSignals(): Promise<GridSignal[]> {
        const { data, error } = await supabase
            .from('grid_signals')
            .select('*')
            .order('timestamp', { ascending: false });
        
        if (error) throw error;
        return data || [];
    },

    async createGridSignal(signal: Omit<GridSignal, 'id'>): Promise<GridSignal> {
        const { data, error } = await supabase
            .from('grid_signals')
            .insert(signal)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    },

    // Energy Data
    async getEnergyData(assetId: string, startDate: string, endDate: string): Promise<EnergyData[]> {
        const { data, error } = await supabase
            .from('energy_data')
            .select('*')
            .eq('asset_id', assetId)
            .gte('timestamp', startDate)
            .lte('timestamp', endDate)
            .order('timestamp');
        
        if (error) throw error;
        return data || [];
    },

    async createEnergyData(energyData: Omit<EnergyData, 'id'>): Promise<EnergyData> {
        const { data, error } = await supabase
            .from('energy_data')
            .insert(energyData)
            .select()
            .single();
        
        if (error) throw error;
        return data;
    }
};

export class EnergyManagementService {
  private initialized = false;
  private models: {
    demand: MLService;
    generation: MLService;
    optimization: MLService;
    battery: MLService;
  };

  constructor() {
    this.models = {
      demand: new MLService({
        modelPath: '/models/demand_forecast',
        modelType: 'consumption',
        inputShape: [24, 7],
        outputShape: [24],
        featureNames: ['hour', 'day', 'temperature', 'occupancy']
      }),
      generation: new MLService({
        modelPath: '/models/solar_forecast',
        modelType: 'weather',
        inputShape: [24, 5],
        outputShape: [24],
        featureNames: ['hour', 'irradiance', 'temperature', 'cloud_cover']
      }),
      optimization: new MLService({
        modelPath: '/models/energy_optimization',
        modelType: 'cost',
        inputShape: [48, 10],
        outputShape: [24],
        featureNames: ['demand', 'generation', 'battery', 'tariff']
      }),
      battery: new MLService({
        modelPath: '/models/battery_health',
        modelType: 'battery',
        inputShape: [24, 8],
        outputShape: [5],
        featureNames: ['voltage', 'current', 'temperature', 'soc']
      })
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await Promise.all([
        this.models.demand.initialize(),
        this.models.generation.initialize(),
        this.models.optimization.initialize(),
        this.models.battery.initialize()
      ]);
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize energy management service:', error);
      throw error;
    }
  }

  async predictEnergyProfile(
    weather: WeatherImpact,
    userBehavior: UserBehavior,
    currentState: {
      battery_level: number;
      grid_import: number;
      grid_export: number;
    }
  ): Promise<EnergyPrediction[]> {
    if (!this.initialized) {
      throw new Error('Energy management service not initialized');
    }

    try {
      // Simulate ML predictions for now
      const predictions: EnergyPrediction[] = [];
      const now = new Date();

      for (let i = 0; i < 24; i++) {
        const timestamp = new Date(now.getTime() + i * 60 * 60 * 1000);
        predictions.push({
          timestamp: timestamp.toISOString(),
          consumption: Math.random() * 5 + 2,
          generation: Math.random() * 3,
          battery_level: Math.min(100, currentState.battery_level + (Math.random() * 10 - 5)),
          grid_import: Math.max(0, Math.random() * 3),
          grid_export: Math.max(0, Math.random() * 2),
          confidence: 0.8 + Math.random() * 0.2
        });
      }

      return predictions;
    } catch (error) {
      console.error('Failed to predict energy profile:', error);
      throw error;
    }
  }

  async analyzeBatteryHealth(telemetryData: TelemetryData[]): Promise<BatteryHealth> {
    if (!this.initialized) {
      throw new Error('Energy management service not initialized');
    }

    try {
      // Simulate battery health analysis
      return {
        state_of_health: 0.85 + Math.random() * 0.1,
        state_of_charge: 0.4 + Math.random() * 0.6,
        temperature: 25 + Math.random() * 10,
        cycle_count: Math.floor(Math.random() * 1000),
        remaining_life: 0.7 + Math.random() * 0.3,
        health_status: Math.random() > 0.8 ? 'warning' : 'good'
      };
    } catch (error) {
      console.error('Failed to analyze battery health:', error);
      throw error;
    }
  }

  async optimizeEnergyStorage(
    predictions: EnergyPrediction[],
    batteryHealth: BatteryHealth,
    costOptimization: CostOptimization
  ): Promise<EnergyAction[]> {
    if (!this.initialized) {
      throw new Error('Energy management service not initialized');
    }

    try {
      // Simulate energy storage optimization
      const actions: EnergyAction[] = [];
      const now = new Date();

      for (let i = 0; i < 24; i++) {
        const hour = now.getHours() + i;
        const isPeakHour = hour >= 8 && hour <= 20;

        actions.push({
          type: isPeakHour ? 'discharge' : 'charge',
          power: Math.random() * 5,
          duration: 60,
          priority: isPeakHour ? 2 : 1,
          reason: isPeakHour ? 'Peak tariff period' : 'Off-peak charging'
        });
      }

      return actions;
    } catch (error) {
      console.error('Failed to optimize energy storage:', error);
      throw error;
    }
  }

  async dispose(): Promise<void> {
    try {
      await Promise.all([
        this.models.demand.dispose(),
        this.models.generation.dispose(),
        this.models.optimization.dispose(),
        this.models.battery.dispose()
      ]);
      this.initialized = false;
    } catch (error) {
      console.error('Failed to dispose energy management service:', error);
      throw error;
    }
  }
} 