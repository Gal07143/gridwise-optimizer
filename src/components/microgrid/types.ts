
export interface MicrogridState {
  batteryCharge: number;
  batteryCharging: boolean;
  batteryCurrent: number;
  batteryCapacity: number;
  solarOutput: number;
  solarConnected: boolean;
  solarEfficiency: number;
  windOutput: number;
  windConnected: boolean;
  windSpeed: number;
  gridPower: number;
  gridConnection: boolean;
  gridConnected?: boolean; // Legacy field, use gridConnection instead
  loadDemand: number;
  loadConnected: boolean;
  buildingEfficiency: number;
  timestamp: Date;
  systemMode: 'auto' | 'manual' | 'eco' | 'backup';
  
  // Add missing properties needed by components
  solarProduction: number;
  windProduction: number;
  batteryLevel: number;
  batteryDischargeEnabled: boolean;
  batteryChargeEnabled: boolean;
  loadConsumption: number;
  gridImport: number;
  gridExport: number;
  frequency: number;
  voltage: number;
  lastUpdated: string;
  operatingMode: 'auto' | 'manual' | 'eco' | 'backup';
  batteryChargeRate: number;
  gridImportEnabled: boolean;
  gridExportEnabled: boolean;
  batterySelfConsumptionMode: boolean;
  economicMode: boolean;
  peakShavingEnabled: boolean;
  demandResponseEnabled: boolean;
}

export interface MicrogridAction {
  type: string;
  payload?: any;
}

export interface MicrogridContextType {
  state: MicrogridState;
  dispatch: React.Dispatch<MicrogridAction>;
}

export interface DeviceStatus {
  id: string;
  name: string;
  type: 'solar' | 'battery' | 'wind' | 'grid' | 'load';
  status: 'online' | 'offline' | 'error' | 'maintenance';
  output: number;
  details: {
    [key: string]: string | number;
  };
}

export interface SystemAlert {
  id: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  source: string;
  acknowledged: boolean;
}

export interface CommandHistoryItem {
  id?: string;
  timestamp: string;
  command: string;
  success: boolean;
  user: string;
  details?: string;
}

export interface MicrogridInsight {
  id: string;
  title: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  category: 'efficiency' | 'performance' | 'savings' | 'reliability';
  value?: number;
  unit?: string;
}

// Additional interfaces needed for MicrogridProvider
export interface MicrogridDevice {
  id: string;
  name: string;
  type: string;
  status: string;
  location: string | null;
  capacity: number;
  site_id?: string | null;
  last_updated: string;
  created_at: string;
}

export interface MicrogridAlert {
  id: string;
  device_id: string;
  type: string;
  message: string;
  title: string;
  timestamp: string;
  acknowledged: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface MicrogridSystemState {
  mode: 'auto' | 'manual' | 'eco' | 'backup';
  status: string;
  gridConnected: boolean;
  lastModeChange: string;
  batteryReserve: number;
  prioritizeRenewables: boolean;
  energyExport: boolean;
  safetyProtocols: boolean;
}

export interface ControlSettings {
  prioritizeSelfConsumption: boolean;
  gridExportLimit: number;
  minBatteryReserve: number;
  peakShavingEnabled: boolean;
  peakShavingThreshold: number;
  demandResponseEnabled: boolean;
  economicOptimizationEnabled: boolean;
  weatherPredictiveControlEnabled: boolean;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  deviceId?: string;
  acknowledged: boolean;
}

export interface CommandHistoryProps {
  commandHistory: CommandHistoryItem[];
}
