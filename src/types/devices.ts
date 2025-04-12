/**
 * Device type definitions for the energy management system
 */

// Energy Generation Devices
export type EnergyGenerationDeviceType = 
  | 'solar'      // PV/Solar systems
  | 'wind'       // Wind turbines
  | 'hydro'      // Hydroelectric systems
  | 'generator'; // Backup generators

// Energy Storage Devices
export type EnergyStorageDeviceType = 
  | 'battery'    // Battery storage systems
  | 'ev_charger'; // Electric vehicle chargers

// Energy Distribution Devices
export type EnergyDistributionDeviceType = 
  | 'grid'       // Grid connection
  | 'inverter'   // Power inverters
  | 'load';      // Load management

// Monitoring and Control Devices
export type MonitoringDeviceType = 
  | 'meter'      // Energy meters
  | 'sensor'     // Various sensors
  | 'controller'; // System controllers

// Network Devices
export type NetworkDeviceType = 
  | 'router'     // Network routers
  | 'mqtt'       // MQTT devices
  | 'http'       // HTTP devices
  | 'api';       // API connections

// Combined device type
export type DeviceType = 
  | EnergyGenerationDeviceType
  | EnergyStorageDeviceType
  | EnergyDistributionDeviceType
  | MonitoringDeviceType
  | NetworkDeviceType;

// Device categories for organization
export const DEVICE_CATEGORIES = {
  GENERATION: 'Energy Generation',
  STORAGE: 'Energy Storage',
  DISTRIBUTION: 'Energy Distribution',
  MONITORING: 'Monitoring & Control',
  NETWORK: 'Network Devices',
} as const;

// Device type to category mapping
export const DEVICE_TYPE_CATEGORY: Record<DeviceType, keyof typeof DEVICE_CATEGORIES> = {
  // Energy Generation
  solar: 'GENERATION',
  wind: 'GENERATION',
  hydro: 'GENERATION',
  generator: 'GENERATION',
  
  // Energy Storage
  battery: 'STORAGE',
  ev_charger: 'STORAGE',
  
  // Energy Distribution
  grid: 'DISTRIBUTION',
  inverter: 'DISTRIBUTION',
  load: 'DISTRIBUTION',
  
  // Monitoring & Control
  meter: 'MONITORING',
  sensor: 'MONITORING',
  controller: 'MONITORING',
  
  // Network Devices
  router: 'NETWORK',
  mqtt: 'NETWORK',
  http: 'NETWORK',
  api: 'NETWORK',
};

// Device status types
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error' | 'warning';

// Device protocol types
export type DeviceProtocol = 'mqtt' | 'modbus' | 'opcua' | 'bacnet' | 'http' | 'api';

// Base device interface
export interface BaseDevice {
  id: string;
  name: string;
  type: DeviceType;
  protocol: DeviceProtocol;
  status: DeviceStatus;
  last_seen: string | null;
  site_id?: string;
  description?: string;
  manufacturer?: string;
  model?: string;
  firmware_version?: string;
  created_at: string;
  updated_at: string;
  metrics?: Record<string, any>;
  settings?: Record<string, any>;
  connection_details?: Record<string, any>;
} 