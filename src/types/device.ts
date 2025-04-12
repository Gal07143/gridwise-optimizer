/**
 * Device status type
 */
export type DeviceStatus = 'online' | 'offline';

/**
 * Device protocol type
 */
export type DeviceProtocol = 'mqtt' | 'http' | 'modbus';

/**
 * Device command type
 */
export interface DeviceCommand {
  command: string;
  parameters?: Record<string, any>;
  timestamp?: string;
}

/**
 * Device interface representing a device in the system
 */
export interface Device {
  id: string;
  name: string;
  type: string;
  protocol: DeviceProtocol;
  status: DeviceStatus;
  last_seen: string | null;
  mqtt_topic: string;
  http_endpoint?: string;
  ip_address?: string;
  port?: number;
  slave_id?: number;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * TelemetryData interface representing telemetry data from a device
 */
export interface TelemetryData {
  deviceId: string;
  timestamp: Date;
  temperature?: number;
  voltage?: number;
  current?: number;
  powerFactor?: number;
  frequency?: number;
  vibration?: number;
  noiseLevel?: number;
  errorCount?: number;
  uptime?: number;
  loadFactor?: number;
  [key: string]: any; // Allow for additional properties
}

/**
 * Device context state interface
 */
export interface DeviceContextState {
  devices: Device[];
  loading: boolean;
  error: string | null;
  selectedDevice: Device | null;
  deviceTelemetry: Record<string, TelemetryData[]>;
}

/**
 * Device context operations interface
 */
export interface DeviceContextOperations {
  fetchDevices: () => Promise<void>;
  addDevice: (device: Omit<Device, 'id'>) => Promise<void>;
  updateDevice: (id: string, updates: Partial<Device>) => Promise<void>;
  deleteDevice: (id: string) => Promise<void>;
  sendCommand: (deviceId: string, command: DeviceCommand) => Promise<void>;
  selectDevice: (device: Device | null) => void;
  fetchDeviceTelemetry: (deviceId: string) => Promise<void>;
}

/**
 * Device context type combining state and operations
 */
export type DeviceContextType = DeviceContextState & DeviceContextOperations;

/**
 * Custom error types for device operations
 */
export class DeviceError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'DeviceError';
  }
}

export class DeviceNotFoundError extends DeviceError {
  constructor(deviceId: string) {
    super(`Device with ID ${deviceId} not found`, 'DEVICE_NOT_FOUND');
  }
}

export class DeviceOperationError extends DeviceError {
  constructor(operation: string, message: string) {
    super(`Failed to ${operation}: ${message}`, 'DEVICE_OPERATION_FAILED');
  }
}

export class DeviceConnectionError extends DeviceError {
  constructor(deviceId: string, message: string) {
    super(`Failed to connect to device ${deviceId}: ${message}`, 'DEVICE_CONNECTION_FAILED');
  }
} 