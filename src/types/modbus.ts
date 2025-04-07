
export interface ModbusDeviceConfig {
  id?: string;
  name: string;
  ip: string;
  port: number;
  unit_id: number;
  protocol: string;
  description?: string;
  is_active: boolean;
  inserted_at?: string;
  updated_at?: string;
}

export type ModbusDevice = ModbusDeviceConfig;

export interface ModbusRegister {
  id: string;
  device_id: string;
  register_name: string;
  register_address: number;
  register_length: number;
  scaling_factor: number;
  created_at?: string;
}

export interface ModbusRegisterMap {
  id: string;
  device_id: string;
  register_map: Record<string, any>;
  created_at: string;
  updated_at: string;
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
