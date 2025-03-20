
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';

export interface ValidationError {
  field: string;
  message: string;
}

export const validateDeviceData = (deviceData: Partial<EnergyDevice>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Validate required fields
  if (!deviceData.name || deviceData.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Device name is required'
    });
  }
  
  if (!deviceData.type) {
    errors.push({
      field: 'type',
      message: 'Device type is required'
    });
  } else if (!isValidDeviceType(deviceData.type)) {
    errors.push({
      field: 'type',
      message: 'Invalid device type'
    });
  }
  
  if (!deviceData.status) {
    errors.push({
      field: 'status',
      message: 'Device status is required'
    });
  } else if (!isValidDeviceStatus(deviceData.status)) {
    errors.push({
      field: 'status',
      message: 'Invalid device status'
    });
  }
  
  if (deviceData.capacity !== undefined) {
    if (deviceData.capacity <= 0) {
      errors.push({
        field: 'capacity',
        message: 'Capacity must be greater than 0'
      });
    }
  } else {
    errors.push({
      field: 'capacity',
      message: 'Capacity is required'
    });
  }
  
  return errors;
};

export const formatValidationErrors = (errors: ValidationError[]): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  
  errors.forEach(error => {
    formattedErrors[error.field] = error.message;
  });
  
  return formattedErrors;
};

// Helper functions to validate device type and status
function isValidDeviceType(type: string): boolean {
  const validTypes: DeviceType[] = [
    'solar', 'wind', 'battery', 'grid', 'load', 'ev_charger', 'inverter', 'meter'
  ];
  return validTypes.includes(type as DeviceType);
}

function isValidDeviceStatus(status: string): boolean {
  const validStatuses: DeviceStatus[] = [
    'online', 'offline', 'maintenance', 'error', 'warning'
  ];
  return validStatuses.includes(status as DeviceStatus);
}
