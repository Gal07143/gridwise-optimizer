
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
  }
  
  // Capacity validation
  if (device.capacity <= 0) {
    errors.push({
      field: 'capacity',
      message: 'Capacity must be greater than zero'
    });
  }
  
  // Type validation
  const validTypes = ['solar', 'wind', 'battery', 'grid', 'load', 'ev_charger'];
  if (!validTypes.includes(device.type)) {
    errors.push({
      field: 'type',
      message: 'Invalid device type'
    });
  }
  
  // Status validation
  const validStatuses = ['online', 'offline', 'maintenance', 'error'];
  if (!validStatuses.includes(device.status)) {
    errors.push({
      field: 'status',
      message: 'Invalid device status'
    });
  }
  
  return errors;
};

export const errorsToRecord = (errors: ValidationError[]): Record<string, string> => {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
};
