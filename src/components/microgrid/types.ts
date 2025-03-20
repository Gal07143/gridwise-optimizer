
export interface MicrogridState {
  batteryChargeEnabled: boolean;
  batteryDischargeEnabled: boolean;
  gridImportEnabled: boolean;
  gridExportEnabled: boolean;
  solarProduction: number;
  windProduction: number;
  batteryLevel: number;
  batteryChargeRate: number;
  batterySelfConsumptionMode: boolean;
  systemMode: 'automatic' | 'manual' | 'eco' | 'backup';
  economicMode: boolean;
  peakShavingEnabled: boolean;
  demandResponseEnabled: boolean;
  lastUpdated: string;
  
  // Adding missing properties that are used in the codebase
  operatingMode: 'automatic' | 'manual' | 'island' | 'grid-connected';
  gridConnection: boolean;
  batteryCharge: number;
  loadConsumption: number;
  gridImport: number;
  gridExport: number;
  frequency: number;
  voltage: number;
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

export interface CommandHistoryItem {
  timestamp: string;
  command: string;
  success: boolean;
  user: string;
}

export interface AlertItem {
  id: string;
  timestamp: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  acknowledged: boolean;
}

// Add severity field to MicrogridAlert to make it compatible with AlertItem
export interface MicrogridAlert {
  id: string;
  device_id: string;
  type: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  severity: 'low' | 'medium' | 'high'; // Added this field to match AlertItem
}

export interface MicrogridDevice {
  id: string;
  name: string;
  type: string;
  status: string;
  location: string;
  capacity: number;
  site_id: string;
  last_updated: string;
  created_at: string;
}

export interface MicrogridSystemState {
  mode: string;
  status: string;
  gridConnected: boolean;
  lastModeChange: string;
  batteryReserve: number;
  prioritizeRenewables: boolean;
  energyExport: boolean;
  safetyProtocols: boolean;
}
