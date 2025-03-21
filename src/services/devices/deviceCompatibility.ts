
import { DeviceType, DeviceStatus, DatabaseDeviceType, DatabaseDeviceStatus } from '@/types/energy';

/**
 * Helper functions to convert between frontend and database types
 */

// Convert a frontend device type to a database-compatible type
export const toDbDeviceType = (type: DeviceType): DatabaseDeviceType => {
  const dbDeviceTypes: DatabaseDeviceType[] = ['solar', 'wind', 'battery', 'grid', 'load', 'ev_charger'];
  
  if (dbDeviceTypes.includes(type as any)) {
    return type as DatabaseDeviceType;
  }
  
  // Map unsupported types to compatible ones
  switch (type) {
    case 'inverter':
    case 'meter':
      return 'grid'; // Best match for these types
    default:
      return 'grid'; // Default fallback
  }
};

// Convert a frontend device status to a database-compatible status
export const toDbDeviceStatus = (status: DeviceStatus): DatabaseDeviceStatus => {
  const dbDeviceStatuses: DatabaseDeviceStatus[] = ['online', 'offline', 'maintenance', 'error'];
  
  if (dbDeviceStatuses.includes(status as any)) {
    return status as DatabaseDeviceStatus;
  }
  
  // Map unsupported statuses to compatible ones
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
