
export interface ModbusDevice {
  id: string;
  name: string;
  description?: string;
  ip: string;
  port: number;
  unit_id: number;
  protocol: string;
  is_active: boolean;
  site_id?: string;
  inserted_at: string;
  updated_at: string;
}

export interface ModbusDeviceConfig {
  id?: string;
  name: string;
  description?: string;
  ip: string;
  port: number;
  unit_id: number;
  protocol: string;
  is_active: boolean;
  site_id?: string;
  inserted_at?: string;
  updated_at?: string;
}

export interface ModbusRegister {
  id: string;
  device_id: string;
  register_name: string;
  register_address: number;
  register_length: number;
  scaling_factor: number;
  created_at?: string;
}

export interface ModbusRegisterDefinition {
  id?: string;
  name: string;
  address: number;
  length: number;
  type: string;
  dataType: string; 
  unit?: string;
  description?: string;
  scale?: number;
  register_map_id?: string;
}

export interface ModbusRegisterMap {
  id?: string;
  name?: string;
  device_id: string;
  description?: string;
  registers: ModbusRegisterDefinition[];
  created_at?: string;
  updated_at?: string;
}

export interface ModbusReadingResult {
  success: boolean;
  value?: number;
  error?: string;
  timestamp?: string;
}

export interface ModbusDeviceStatus {
  online: boolean;
  lastSeen?: string;
  error?: string;
}

export interface ConnectionStatusOptions {
  deviceId?: string;
  interval?: number;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Error) => void;
}

export interface ConnectionStatus {
  isConnected: boolean;
  isConnecting: boolean;
  lastConnected: Date | null;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
}

export type ConnectionStatusResult = {
  isConnected: boolean;
  isConnecting: boolean;
  lastConnected: Date | null;
  error: Error | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  reconnect: () => Promise<void>;
};
