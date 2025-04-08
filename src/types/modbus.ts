
export interface ModbusDeviceConfig {
  id: string;
  name: string;
  ip: string;
  port: number;
  unit_id: number;
  protocol: "tcp" | "rtu";
  is_active: boolean;
  description?: string;
  inserted_at?: string;
  updated_at?: string;
}

export interface ModbusRegisterDefinition {
  id: string;
  device_id?: string;
  name: string;
  address: number;
  registerType: "input" | "holding";
  dataType: "int16" | "uint16" | "int32" | "uint32" | "float32";
  access: "read" | "write" | "read/write";
  scaleFactor?: number;
  unit?: string;
  description?: string;
  register_address?: number;
  register_name?: string;
  register_length?: number;
}

export interface ModbusRegisterMap {
  registers: ModbusRegisterDefinition[];
}

export interface ModbusReadingResult {
  address: number;
  value: number;
  formattedValue: string;
  timestamp: string;
  success: boolean;
  error?: Error;
}

export interface ConnectionStatusResult {
  status: 'connected' | 'disconnected' | 'connecting' | 'error';
  message?: string;
  isConnecting?: boolean;
  connect?: () => Promise<void>;
  disconnect?: () => Promise<void>;
}

export interface ModbusWriteRequest {
  registerAddress: number;
  value: number | boolean;
  registerType: "holding_register" | "coil";
}
