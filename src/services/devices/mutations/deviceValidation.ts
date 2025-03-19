
import { EnergyDevice, DeviceStatus, DeviceType, isValidDeviceStatus, isValidDeviceType } from "@/types/energy";

interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate device type and status
 * @param deviceData Partial device data to validate
 * @returns Array of validation errors or empty array if valid
 */
export const validateDeviceData = (deviceData: Partial<EnergyDevice>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!deviceData.name || deviceData.name.trim() === '') {
    errors.push({ field: 'name', message: 'Device name is required' });
  }
  
  if (!deviceData.location || deviceData.location.trim() === '') {
    errors.push({ field: 'location', message: 'Location is required' });
  }
  
  if (deviceData.type && !isValidDeviceType(deviceData.type)) {
    errors.push({ field: 'type', message: `Invalid device type: ${deviceData.type}` });
  }
  
  if (deviceData.status && !isValidDeviceStatus(deviceData.status)) {
    errors.push({ field: 'status', message: `Invalid device status: ${deviceData.status}` });
  }
  
  if (deviceData.capacity !== undefined && (isNaN(deviceData.capacity) || deviceData.capacity <= 0)) {
    errors.push({ field: 'capacity', message: 'Capacity must be greater than 0' });
  }
  
  return errors;
};

/**
 * Throws an error if validation fails
 * @param deviceData Partial device data to validate
 * @throws Error with validation message if validation fails
 */
export const validateDeviceDataAndThrow = (deviceData: Partial<EnergyDevice>): void => {
  const errors = validateDeviceData(deviceData);
  
  if (errors.length > 0) {
    throw new Error(errors.map(err => err.message).join(', '));
  }
};
