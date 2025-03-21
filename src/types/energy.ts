export type DeviceType = 'solar' | 'wind' | 'battery' | 'grid' | 'load' | 'ev_charger' | 'inverter' | 'meter';
export type DeviceStatus = 'online' | 'offline' | 'maintenance' | 'error' | 'warning';

export type DeviceOperatingMode = 'auto' | 'manual' | 'eco' | 'backup';

export type MicrogridOperatingMode = 'auto' | 'manual' | 'eco' | 'backup';
export type MicrogridConnectionMode = 'island' | 'grid-connected';

// Database compatibility types
export type DatabaseDeviceType = 'solar' | 'wind' | 'battery' | 'grid' | 'load' | 'ev_charger';
export type DatabaseDeviceStatus = 'online' | 'offline' | 'maintenance' | 'error';

// Validation helpers
export const isValidDeviceType = (type: string): type is DeviceType => {
  return ['solar', 'wind', 'battery', 'grid', 'load', 'ev_charger', 'inverter', 'meter'].includes(type as DeviceType);
};

export const isValidDeviceStatus = (status: string): status is DeviceStatus => {
  return ['online', 'offline', 'maintenance', 'error', 'warning'].includes(status as DeviceStatus);
};

// Conversion utilities for database compatibility
export const toDbDeviceType = (type: DeviceType): DatabaseDeviceType => {
  if (['solar', 'wind', 'battery', 'grid', 'load', 'ev_charger'].includes(type as any)) {
    return type as DatabaseDeviceType;
  }
  
  switch (type) {
    case 'inverter':
    case 'meter':
      return 'grid'; // Best match for these types
    default:
      return 'grid'; // Default fallback
  }
};

export const toDbDeviceStatus = (status: DeviceStatus): DatabaseDeviceStatus => {
  if (['online', 'offline', 'maintenance', 'error'].includes(status as any)) {
    return status as DatabaseDeviceStatus;
  }
  
  switch (status) {
    case 'warning':
      return 'maintenance'; // Best match for warning
    default:
      return 'offline'; // Default fallback
  }
};

// Type checking utility for SQL filter conditions
export function isFilterableDeviceType(type: DeviceType): boolean {
  return ['solar', 'wind', 'battery', 'grid', 'load', 'ev_charger'].includes(type as any);
}

export function isFilterableDeviceStatus(status: DeviceStatus): boolean {
  return ['online', 'offline', 'maintenance', 'error'].includes(status as any);
}
