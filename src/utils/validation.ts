
import { DeviceFormState } from "@/hooks/useBaseDeviceForm";

export interface ValidationError {
  field: string;
  message: string;
}

export const validateDeviceForm = (data: DeviceFormState): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!data.name.trim()) {
    errors.push({ field: 'name', message: 'Device name is required' });
  } else if (data.name.trim().length < 3) {
    errors.push({ field: 'name', message: 'Device name must be at least 3 characters' });
  }
  
  if (!data.location.trim()) {
    errors.push({ field: 'location', message: 'Location is required' });
  }
  
  if (data.capacity <= 0) {
    errors.push({ field: 'capacity', message: 'Capacity must be greater than 0' });
  }
  
  return errors;
};

export const errorsToRecord = (errors: ValidationError[]): Record<string, string> => {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
};

export const isEmailValid = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const isPasswordStrong = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};
