
import { EnergyDevice } from '@/types/energy';

interface ValidationError {
  field: string;
  message: string;
}

export const validateDeviceData = (device: Partial<EnergyDevice>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  // Name validation
  if (!device.name) {
    errors.push({
      field: 'name',
      message: 'Device name is required'
    });
  } else if (device.name.length < 2) {
    errors.push({
      field: 'name',
      message: 'Device name must be at least 2 characters long'
    });
  }
  
  // Type validation
  if (!device.type) {
    errors.push({
      field: 'type',
      message: 'Device type is required'
    });
  }
  
  // Status validation
  if (!device.status) {
    errors.push({
      field: 'status',
      message: 'Device status is required'
    });
  }
  
  // Capacity validation (if provided)
  if (device.capacity !== undefined && device.capacity < 0) {
    errors.push({
      field: 'capacity',
      message: 'Capacity must be a positive number'
    });
  }
  
  return errors;
};

export const formatValidationErrors = (errors: ValidationError[]): Record<string, string> => {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
};
