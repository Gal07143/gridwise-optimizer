
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
  id: string;
  timestamp: Date;
  user: string;
  command: string;
  status: 'success' | 'failed' | 'pending';
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
