
import { DeviceType, DeviceStatus } from '@/types/energy';

/**
 * Helper functions to convert between frontend and database types
 */

// Define database compatible types explicitly here
export type DbDeviceType = 'solar' | 'wind' | 'battery' | 'grid' | 'load' | 'ev_charger';
export type DbDeviceStatus = 'online' | 'offline' | 'maintenance' | 'error';

// Convert a frontend device type to a database-compatible type
export const toDbDeviceType = (type: DeviceType): DbDeviceType => {
  const dbDeviceTypes: DbDeviceType[] = ['solar', 'wind', 'battery', 'grid', 'load', 'ev_charger'];
  
  if (dbDeviceTypes.includes(type as any)) {
    return type as DbDeviceType;
  }
  
  // Map unsupported types to compatible ones
  switch (type) {
    case 'inverter':
      return 'solar'; // Best match for inverter
    case 'meter':
      return 'grid'; // Best match for meter
    case 'light':
      return 'load'; // Best match for light
    case 'generator':
    case 'hydro':
      return 'grid'; // Best match for these types
    default:
      return 'grid'; // Default fallback
  }
};

// Convert a frontend device status to a database-compatible status
export const toDbDeviceStatus = (status: DeviceStatus): DbDeviceStatus => {
  const dbDeviceStatuses: DbDeviceStatus[] = ['online', 'offline', 'maintenance', 'error'];
  
  if (dbDeviceStatuses.includes(status as any)) {
    return status as DbDeviceStatus;
  }
  
  // Map unsupported statuses to compatible ones
  switch (status) {
    case 'warning':
      return 'maintenance'; // Best match for warning
    case 'idle':
      return 'online'; // An idle device is still online
    case 'active':
      return 'online'; // An active device is online
    case 'charging':
    case 'discharging':
      return 'online'; // Charging/discharging devices are online
    default:
      return 'offline'; // Default fallback
  }
};

// Convert database device type to frontend device type
export const fromDbDeviceType = (dbType: DbDeviceType): DeviceType => {
  return dbType as DeviceType;
};

// Convert database device status to frontend device status
export const fromDbDeviceStatus = (dbStatus: DbDeviceStatus): DeviceStatus => {
  return dbStatus as DeviceStatus;
};

// Type checking utility for SQL filter conditions
export function isFilterableDeviceType(type: DeviceType): boolean {
  return ['solar', 'wind', 'battery', 'grid', 'load', 'ev_charger'].includes(type as any);
}

export function isFilterableDeviceStatus(status: DeviceStatus): boolean {
  return ['online', 'offline', 'maintenance', 'error'].includes(status as any);
}
