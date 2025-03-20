
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
}
