
import { Device } from "@/types/device";

export interface ValidationError {
  field: string;
  message: string;
}

export function validateDeviceData(data: Partial<Device>): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Validate required fields
  if (data.name === undefined || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'Device name is required' });
  } else if (data.name.length > 100) {
    errors.push({ field: 'name', message: 'Device name must be less than 100 characters' });
  }
  
  if (data.type === undefined || data.type.trim() === '') {
    errors.push({ field: 'type', message: 'Device type is required' });
  }
  
  if (data.capacity !== undefined) {
    if (isNaN(data.capacity)) {
      errors.push({ field: 'capacity', message: 'Capacity must be a number' });
    } else if (data.capacity <= 0) {
      errors.push({ field: 'capacity', message: 'Capacity must be greater than 0' });
    }
  }
  
  // Validate current_output if present
  if (data.current_output !== undefined && data.current_output < 0) {
    errors.push({ field: 'current_output', message: 'Current output cannot be negative' });
  }
  
  // Validate installation_date format if present
  if (data.installation_date !== undefined) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.installation_date)) {
      errors.push({ field: 'installation_date', message: 'Installation date must be in YYYY-MM-DD format' });
    }
  }
  
  return errors;
}

export function validateModbusDeviceData(data: any): ValidationError[] {
  const errors: ValidationError[] = [];
  
  // Validate required fields
  if (!data.name || data.name.trim() === '') {
    errors.push({ field: 'name', message: 'Device name is required' });
  }
  
  if (!data.ip || data.ip.trim() === '') {
    errors.push({ field: 'ip', message: 'IP address is required' });
  }
  
  // Validate port number
  if (data.port === undefined || isNaN(Number(data.port))) {
    errors.push({ field: 'port', message: 'Port must be a number' });
  } else if (Number(data.port) <= 0 || Number(data.port) > 65535) {
    errors.push({ field: 'port', message: 'Port must be between 1 and 65535' });
  }
  
  // Validate unit ID
  if (data.unit_id === undefined || isNaN(Number(data.unit_id))) {
    errors.push({ field: 'unit_id', message: 'Unit ID must be a number' });
  } else if (Number(data.unit_id) < 0 || Number(data.unit_id) > 247) {
    errors.push({ field: 'unit_id', message: 'Unit ID must be between 0 and 247' });
  }
  
  // Validate protocol
  if (!data.protocol) {
    errors.push({ field: 'protocol', message: 'Protocol is required' });
  } else if (data.protocol !== 'tcp' && data.protocol !== 'rtu') {
    errors.push({ field: 'protocol', message: 'Protocol must be either "tcp" or "rtu"' });
  }
  
  return errors;
}
