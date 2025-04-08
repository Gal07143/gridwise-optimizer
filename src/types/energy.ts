
// This file contains all energy-related type definitions for the application

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
  device_id?: string;
  site_id?: string;
  acknowledged: boolean;
  timestamp: string;
  alert_source?: string;
  ack_by?: string;
  ack_at?: string;
  alert_type?: string;
}

export interface EnergyConsumption {
  id: string;
  site_id: string;
  timestamp: string;
  value: number;
  unit: string;
}

export interface EnergyProduction {
  id: string;
  site_id: string;
  timestamp: string;
  value: number;
  unit: string;
  source: string;
}

export interface EnergyCost {
  id: string;
  site_id: string;
  timestamp: string;
  value: number;
  currency: string;
}

export interface EnergyEmission {
  id: string;
  site_id: string;
  timestamp: string;
  value: number;
  unit: string;
}

// Device-related types
export type DeviceType = 'solar' | 'wind' | 'battery' | 'grid' | 'load' | 'ev_charger' | 'inverter' | 'meter' | 'light' | 'generator' | 'hydro' | string;

export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error' | 'warning' | 'idle' | 'active' | 'charging' | 'discharging' | string;

export interface DeviceTypeInfo {
  id: string;
  name: string;
  icon?: string;
  category?: string;
  description?: string;
}

export interface DeviceStatusInfo {
  id: string;
  name: string;
  description?: string;
  severity?: 'info' | 'warning' | 'error' | 'success';
  icon?: string;
}

export interface EnergyDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  site_id?: string;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  install_date?: string;
  last_maintenance?: string;
  next_maintenance?: string;
  firmware_version?: string;
  ip_address?: string;
  mac_address?: string;
  location?: string;
  description?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  telemetry_prefix?: string;
  capacity?: number;
  firmware?: string;
  installation_date?: string;
  metrics?: Record<string, number> | null;
  last_updated?: string;
  enabled?: boolean;
  config?: Record<string, any>;
  protocol?: string;
  lat?: number;
  lng?: number;
  created_by?: string;
}

export interface DeviceModel {
  id: string;
  name: string;
  manufacturer: string;
  type: string;
  protocol?: string;
  description?: string;
  power_rating?: number;
  voltage_rating?: number;
  current_rating?: number;
  dimensions?: string;
  weight?: number;
  efficiency?: number;
  warranty_years?: number;
  datasheet_url?: string;
  manual_url?: string;
  image_url?: string;
  firmware_version?: string;
  support_level: 'none' | 'partial' | 'full' | 'beta';
  created_at?: string;
  updated_at?: string;
  features?: string[];
  certifications?: string[];
  images?: string[] | Record<string, any>;
  has_manual?: boolean;
  has_datasheet?: boolean;
  model_number?: string;
  device_type?: string;
  warranty?: string;
  release_date?: string;
  specifications?: Record<string, any>;
  connectivity?: Record<string, any>;
  compatible_with?: string[];
  videos?: Record<string, any>;
  manuals?: Record<string, any>;
  datasheets?: Record<string, any>;
  category?: string;
}

export interface EnergyReading {
  id?: string;
  device_id: string;
  timestamp: string;
  metric?: string;
  value: number;
  unit?: string;
  created_at?: string;
  // Adding properties that were missing from the interface
  power?: number;
  energy?: number;
  voltage?: number;
  current?: number;
  frequency?: number;
  temperature?: number;
  state_of_charge?: number;
  quality?: number;
  reading_type?: string;
}

export interface TelemetryData {
  timestamp: string;
  value: number;
  deviceId: string;
  metricId: string;
}

export interface EnergyForecast {
  id?: string;
  site_id: string;
  forecast_type?: 'production' | 'consumption' | 'demand' | 'price';
  forecast_time?: string;
  timestamp: string;
  value?: number;
  confidence?: number;
  unit?: string;
  source?: string;
  created_at?: string;
  generation_forecast?: number;
  consumption_forecast?: number;
  weather_condition?: string;
  temperature?: number;
  cloud_cover?: number;
  wind_speed?: number;
}

// Site types
export interface Site {
  id: string;
  name: string;
  location: string;
  timezone: string;
  lat?: number;
  lng?: number;
  created_at: string;
  updated_at: string;
  // Required by some components
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  type?: string;
  status?: string;
  description?: string;
  contact_person?: string;
  contact_email?: string;
}

// Modbus types
export interface ModbusDevice {
  id: string;
  name: string;
  address: string;
  port: number;
  unit_id: number;
  protocol: 'tcp' | 'rtu';
  description?: string;
  site_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ModbusDeviceConfig {
  id: string;
  name: string;
  address: string;
  port: number;
  unit_id: number;
  protocol: 'tcp' | 'rtu';
  description?: string;
  site_id?: string;
}

export interface ModbusRegisterDefinition {
  id: string;
  device_id: string;
  register_address: number;
  register_type: 'coil' | 'discrete_input' | 'input_register' | 'holding_register';
  register_name: string;
  register_length: number;
  data_type: 'boolean' | 'int16' | 'uint16' | 'int32' | 'uint32' | 'float32' | 'float64' | 'string';
  description?: string;
  unit?: string;
  scaling_factor?: number;
  offset?: number;
  byte_order?: 'big_endian' | 'little_endian';
}

export interface ModbusReadingResult {
  timestamp: string;
  register_address: number;
  value: number | boolean | string;
  raw_value?: number | boolean | string;
  device_id: string;
  register_id: string;
  register_name?: string;
  unit?: string;
}

export interface ConnectionStatusResult {
  isConnected: boolean;
  lastConnected?: string;
  errorMessage?: string;
  isConnecting: boolean;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
}

export type SupportLevel = 'none' | 'partial' | 'full' | 'beta';

