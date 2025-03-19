
import { EnergyDevice, DeviceStatus, DeviceType, isValidDeviceStatus, isValidDeviceType } from "@/types/energy";

export interface ValidationError {
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
  
  // Required fields validation
  if (!deviceData.name || deviceData.name.trim() === '') {
    errors.push({ field: 'name', message: 'Device name is required' });
  } else if (deviceData.name.length > 100) {
    errors.push({ field: 'name', message: 'Device name must be less than 100 characters' });
  }
  
  if (!deviceData.location || deviceData.location.trim() === '') {
    errors.push({ field: 'location', message: 'Location is required' });
  }
  
  // Type validation
  if (!deviceData.type) {
    errors.push({ field: 'type', message: 'Device type is required' });
  } else if (!isValidDeviceType(deviceData.type)) {
    errors.push({ field: 'type', message: `Invalid device type: ${deviceData.type}` });
  }
  
  // Status validation
  if (deviceData.status && !isValidDeviceStatus(deviceData.status)) {
    errors.push({ field: 'status', message: `Invalid device status: ${deviceData.status}` });
  }
  
  // Capacity validation
  if (deviceData.capacity === undefined || deviceData.capacity === null) {
    errors.push({ field: 'capacity', message: 'Capacity is required' });
  } else if (isNaN(deviceData.capacity) || deviceData.capacity <= 0) {
    errors.push({ field: 'capacity', message: 'Capacity must be greater than 0' });
  } else if (deviceData.capacity > 1000000) {
    errors.push({ field: 'capacity', message: 'Capacity value is unrealistically high' });
  }
  
  // Optional field format validation
  if (deviceData.firmware && deviceData.firmware.length > 50) {
    errors.push({ field: 'firmware', message: 'Firmware version must be less than 50 characters' });
  }
  
  if (deviceData.description && deviceData.description.length > 1000) {
    errors.push({ field: 'description', message: 'Description must be less than 1000 characters' });
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
    throw new Error(errors.map(err => `${err.field}: ${err.message}`).join(', '));
  }
};

/**
 * Format validation errors into a record for easier form handling
 * @param errors Array of validation errors
 * @returns Record with field names as keys and error messages as values
 */
export const formatValidationErrors = (errors: ValidationError[]): Record<string, string> => {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
};
