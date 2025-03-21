
import { DeviceStatus, DeviceType } from '@/types/energy';
import { toDbDeviceType, toDbDeviceStatus } from '@/services/devices/deviceCompatibility';

/**
 * Converts frontend DeviceType to database compatible string
 * This is necessary because the database enum might not support all frontend types
 */
export const convertDeviceTypeForDb = (type: DeviceType): "solar" | "wind" | "battery" | "grid" | "load" | "ev_charger" => {
  return toDbDeviceType(type);
};

/**
 * Converts frontend DeviceStatus to database compatible string
 * This is necessary because the database enum might not support all frontend statuses
 */
export const convertDeviceStatusForDb = (status: DeviceStatus): "online" | "offline" | "maintenance" | "error" => {
  return toDbDeviceStatus(status);
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
