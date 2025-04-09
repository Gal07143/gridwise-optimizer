
export interface ValidationError {
  field: string;
  message: string;
}

export const validateDevice = (deviceData: any): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Required fields
  if (!deviceData.name) {
    errors.push({ field: 'name', message: 'Device name is required' });
  }

  if (!deviceData.type) {
    errors.push({ field: 'type', message: 'Device type is required' });
  }

  if (deviceData.capacity === undefined || deviceData.capacity === null) {
    errors.push({ field: 'capacity', message: 'Capacity is required' });
  } else if (isNaN(Number(deviceData.capacity)) || Number(deviceData.capacity) <= 0) {
    errors.push({ field: 'capacity', message: 'Capacity must be a positive number' });
  }

  if (!deviceData.site_id) {
    errors.push({ field: 'site_id', message: 'Site is required' });
  }

  // Validate ip_address if provided for certain device types
  if (deviceData.ip_address && !isValidIpAddress(deviceData.ip_address)) {
    errors.push({ field: 'ip_address', message: 'Invalid IP address format' });
  }

  // Type-specific validations
  if (deviceData.type === 'battery' && deviceData.capacity <= 0) {
    errors.push({ field: 'capacity', message: 'Battery capacity must be greater than zero' });
  }

  if (deviceData.type === 'solar' && deviceData.capacity <= 0) {
    errors.push({ field: 'capacity', message: 'Solar capacity must be greater than zero' });
  }

  return errors;
};

export const formatValidationErrors = (errors: ValidationError[]): Record<string, string> => {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
};

const isValidIpAddress = (ip: string): boolean => {
  if (!ip) return false;
  
  // Simple regex for IPv4 address
  const ipv4Pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = ip.match(ipv4Pattern);
  
  if (!match) return false;
  
  // Check each octet is between 0 and 255
  for (let i = 1; i <= 4; i++) {
    const octet = parseInt(match[i], 10);
    if (octet < 0 || octet > 255) return false;
  }
  
  return true;
};
