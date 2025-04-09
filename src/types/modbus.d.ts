
export interface ModbusDevice {
  id: string;
  name: string;
  ip: string;
  ip_address?: string; // Alias for ip for backwards compatibility
  port: number;
  unit_id: number;
  is_active: boolean;
  description?: string;
  protocol: "tcp" | "rtu";
  inserted_at?: string;
  updated_at: string;
  site_id?: string;
}

export interface ModbusDeviceConfig {
  id?: string;
  name: string;
  ip: string;
  ip_address?: string; // Alias for compatibility
  port: number;
  unit_id: number;
  protocol: "tcp" | "rtu";
  is_active: boolean;
  description?: string;
  site_id?: string;
}

export interface ModbusRegister {
  id?: string;
  name: string;
  address: number;
  device_id: string;
  register_type: "holding" | "input" | "coil" | "discrete_input";
  data_type: "int16" | "uint16" | "int32" | "uint32" | "float" | "boolean" | "string";
  scaleFactor?: number;
  scaling_factor?: number; // Alias for scaleFactor for backwards compatibility
  unit?: string;
  description?: string;
  access?: "read" | "write" | "read_write";
  is_active?: boolean;
  update_frequency?: number;
  high_alarm?: number;
  low_alarm?: number;
  last_value?: any;
  last_read?: string;
}

export interface ModbusRegisterDefinition extends ModbusRegister {
  device_name?: string;
}

export interface ModbusRegisterMap {
  id?: string;
  name: string;
  registers: ModbusRegister[];
  description?: string;
  device_id?: string;
}

export interface ModbusReadResult {
  value: number | boolean | string;
  raw_value?: number | boolean;
  timestamp: string;
  register?: ModbusRegister;
  error?: string;
  success: boolean;
}

export interface ConnectionStatusOptions {
  initialStatus?: boolean;
  reconnectDelay?: number;
  showToasts?: boolean;
  deviceId?: string;
  autoConnect?: boolean;
  retryInterval?: number;
  maxRetries?: number;
}

export interface ConnectionStatusResult {
  isOnline: boolean;
  isConnecting?: boolean;
  isConnected: boolean;
  lastConnected?: Date;
  lastOnline: Date | null;
  lastOffline: Date | null;
  error: Error | null;
  status: "connected" | "connecting" | "disconnected" | "error" | "ready";
  message?: string;
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
  retryConnection?: () => Promise<void>;
}
