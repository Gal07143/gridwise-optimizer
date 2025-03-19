
// Types for the Microgrid Control Panel

export interface MicrogridState {
  operatingMode: 'automatic' | 'manual' | 'island' | 'grid-connected';
  gridConnection: boolean;
  batteryDischargeEnabled: boolean;
  solarProduction: number;
  windProduction: number;
  batteryCharge: number;
  loadConsumption: number;
  gridImport: number;
  gridExport: number;
  frequency: number;
  voltage: number;
  lastUpdated: string;
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
