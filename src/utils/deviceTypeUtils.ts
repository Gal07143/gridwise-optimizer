
import { DeviceStatus, DeviceType } from '@/types/energy';

/**
 * Converts frontend DeviceType to database compatible string
 * This is necessary because the database enum might not support all frontend types
 */
export const convertDeviceTypeForDb = (type: DeviceType): "solar" | "wind" | "battery" | "grid" | "load" | "ev_charger" => {
  // Map frontend types to database-supported types
  if (type === 'inverter' || type === 'meter') {
    return 'grid'; // Default mapping for unsupported types
  }
  return type as "solar" | "wind" | "battery" | "grid" | "load" | "ev_charger";
};

/**
 * Converts frontend DeviceStatus to database compatible string
 * This is necessary because the database enum might not support all frontend statuses
 */
export const convertDeviceStatusForDb = (status: DeviceStatus): "online" | "offline" | "maintenance" | "error" => {
  // Map frontend statuses to database-supported statuses
  if (status === 'warning') {
    return 'error'; // Map 'warning' to 'error' for database compatibility
  }
  return status as "online" | "offline" | "maintenance" | "error";
};

/**
 * Converts database device type to frontend DeviceType
 */
export const convertDbToDeviceType = (dbType: string): DeviceType => {
  return dbType as DeviceType;
};

/**
 * Converts database device status to frontend DeviceStatus
 */
export const convertDbToDeviceStatus = (dbStatus: string): DeviceStatus => {
  return dbStatus as DeviceStatus;
};
