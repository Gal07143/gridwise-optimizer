
import { DeviceFormState } from "@/hooks/useBaseDeviceForm";

export interface ValidationError {
  field: string;
  message: string;
}

export const validateDeviceForm = (device: DeviceFormState): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Name validation
  if (!device.name) {
    errors.push({
      field: 'name',
      message: 'Device name is required'
    });
  } else if (device.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Device name cannot be empty'
    });
  } else if (device.name.length < 3) {
    errors.push({
      field: 'name',
      message: 'Name must be at least 3 characters long'
    });
  } else if (device.name.length > 50) {
    errors.push({
      field: 'name',
      message: 'Name must be less than 50 characters'
    });
  }
  
  // Location validation
  if (!device.location) {
    errors.push({
      field: 'location',
      message: 'Location is required'
    });
  } else if (device.location.trim() === '') {
    errors.push({
      field: 'location',
      message: 'Location cannot be empty'
    });
  }
  
  // Capacity validation
  if (device.capacity === undefined || device.capacity === null) {
    errors.push({
      field: 'capacity',
      message: 'Capacity is required'
    });
  } else if (isNaN(Number(device.capacity))) {
    errors.push({
      field: 'capacity',
      message: 'Capacity must be a number'
    });
  } else if (Number(device.capacity) <= 0) {
    errors.push({
      field: 'capacity',
      message: 'Capacity must be greater than zero'
    });
  } else if (Number(device.capacity) > 100000) {
    errors.push({
      field: 'capacity',
      message: 'Capacity value seems unrealistically high'
    });
  }
  
  // Type validation
  const validTypes = ['solar', 'wind', 'battery', 'grid', 'load', 'ev_charger'];
  if (!device.type) {
    errors.push({
      field: 'type',
      message: 'Device type is required'
    });
  } else if (!validTypes.includes(device.type)) {
    errors.push({
      field: 'type',
      message: 'Invalid device type'
    });
  }
  
  // Status validation
  const validStatuses = ['online', 'offline', 'maintenance', 'error'];
  if (!device.status) {
    errors.push({
      field: 'status',
      message: 'Device status is required'
    });
  } else if (!validStatuses.includes(device.status)) {
    errors.push({
      field: 'status',
      message: 'Invalid device status'
    });
  }
  
  // Firmware validation - optional but should be in a valid format if provided
  if (device.firmware && device.firmware.length > 0) {
    const firmwareRegex = /^[vV]?\d+(\.\d+)*(-[a-zA-Z0-9]+)?$/;
    if (!firmwareRegex.test(device.firmware)) {
      errors.push({
        field: 'firmware',
        message: 'Firmware version should be in a valid format (e.g., v1.2.3)'
      });
    }
  }
  
  return errors;
};

export const errorsToRecord = (errors: ValidationError[]): Record<string, string> => {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
};

// Utility function to check if a value is empty (null, undefined, or empty string)
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  return false;
};

// Utility function to sanitize user input
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  // Basic sanitization to prevent XSS
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};
