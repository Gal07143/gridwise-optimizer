export type DeviceType = 'sensor' | 'actuator' | 'controller' | 'pv_panel' | 'ev_charger' | 'battery' | 'smart_meter';

export type EnergySource = 'grid' | 'solar' | 'battery';

export interface EnergyMetrics {
  currentPower: number;        // in watts
  voltage: number;            // in volts
  current: number;           // in amperes
  frequency: number;         // in Hz
  powerFactor: number;      // between 0 and 1
  totalEnergy: number;      // in kWh
  timestamp: Date;
}

export interface ForecastData {
  timestamp: Date;
  predictedPower: number;   // in watts
  confidence: number;       // between 0 and 1
  weatherCondition: string;
}

export interface DeviceSettings {
  enabled: boolean;
  autoUpdate: boolean;
  alertThresholds: {
    minPower?: number;
    maxPower?: number;
    minVoltage?: number;
    maxVoltage?: number;
    minEfficiency?: number;
  };
  scheduledOperations?: {
    startTime: string;
    endTime: string;
    mode: 'charge' | 'discharge' | 'idle';
  }[];
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: 'online' | 'offline' | 'maintenance' | 'fault';
  location: {
    zone: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  lastSeen: Date;
  metadata: {
    manufacturer: string;
    model: string;
    serialNumber: string;
    firmwareVersion: string;
    capacity?: number;          // for batteries and PV panels
    maxChargingPower?: number; // for EV chargers
    efficiency?: number;       // for power conversion devices
  };
  settings: DeviceSettings;
  currentMetrics?: EnergyMetrics;
  forecastData?: ForecastData[];
}

export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  model: string;
  model_number: string;
  device_type: string;
  category: string;
  protocol?: string;
  firmware_version?: string;
  supported: boolean;
  description?: string;
  images?: string[];
  has_manual?: boolean;
  has_datasheet?: boolean;
  has_video?: boolean;
  power_rating?: number;
  capacity?: number;
  created_at?: string;
  updated_at?: string;
}

export interface DeviceModelReference {
  id: string;
  name: string;
  manufacturer: string;
  model_number: string;
  device_type: string;
  category: string;
  has_manual?: boolean;
}
