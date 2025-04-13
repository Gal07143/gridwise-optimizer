
import { EnergyDevice } from '@/types/energy';

/**
 * Interface for validation errors
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validates device data before creation or update
 * @param deviceData Device data to validate
 * @returns Array of validation errors, empty if valid
 */
export const validateDeviceData = (deviceData: Partial<EnergyDevice>): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Required fields
  if (!deviceData.name || deviceData.name.trim() === '') {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  if (!deviceData.type) {
    errors.push({ field: 'type', message: 'Device type is required' });
  }

  if (!deviceData.status) {
    errors.push({ field: 'status', message: 'Status is required' });
  }

  // Capacity validation
  if (deviceData.capacity !== undefined && deviceData.capacity <= 0) {
    errors.push({ field: 'capacity', message: 'Capacity must be greater than 0' });
  }

  return errors;
};

/**
 * Formats validation errors into a record for easier form handling
 * @param errors Array of validation errors
 * @returns Record with field names as keys and error messages as values
 */
export const formatValidationErrors = (errors: ValidationError[]): Record<string, string> => {
  const formattedErrors: Record<string, string> = {};
  
  errors.forEach(error => {
    formattedErrors[error.field] = error.message;
  });
  
  return formattedErrors;
};
