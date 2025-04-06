
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

export interface ModbusRegisterDefinition {
  id?: string;
  name: string;
  address: number;
  length: number;
  type: string;
  dataType: string; 
  unit: string;
  description?: string;
  register_map_id?: string;
}

export interface ModbusRegisterMap {
  id?: string;
  name: string;
  device_id?: string;
  description?: string;
  registers: ModbusRegisterDefinition[];
  created_at?: string;
  updated_at?: string;
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
