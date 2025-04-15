
import { useState } from 'react';

interface DeviceForm {
  name: string;
  type: string;
  location: string;
  status: string;
  capacity?: number;
  firmware?: string;
  description?: string;
}

interface DeviceFormErrors {
  name?: string;
  type?: string;
  location?: string;
  status?: string;
  capacity?: string;
  firmware?: string;
  description?: string;
}

export function useDeviceForm() {
  const [device, setDevice] = useState<DeviceForm>({
    name: '',
    type: '',
    location: '',
    status: 'offline',
    capacity: undefined,
    firmware: '',
    description: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<DeviceFormErrors>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setDevice(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : undefined) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setDevice(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const clearValidationError = (field: keyof DeviceFormErrors) => {
    setValidationErrors(prev => ({
      ...prev,
      [field]: undefined,
    }));
  };

  const validateForm = (): boolean => {
    const errors: DeviceFormErrors = {};
    
    if (!device.name.trim()) {
      errors.name = 'Device name is required';
    }
    
    if (!device.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!device.type) {
      errors.type = 'Device type is required';
    }
    
    if (!device.status) {
      errors.status = 'Status is required';
    }
    
    if (device.capacity !== undefined && device.capacity < 0) {
      errors.capacity = 'Capacity must be a positive number';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return false;
    }
    
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reset form after successful submission
      setDevice({
        name: '',
        type: '',
        location: '',
        status: 'offline',
        capacity: undefined,
        firmware: '',
        description: ''
      });
      
      setIsSaving(false);
      return true;
    } catch (error) {
      console.error('Error saving device:', error);
      setIsSaving(false);
      return false;
    }
  };

  return {
    device,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    isSaving,
    validationErrors,
    clearValidationError,
  };
}

export default useDeviceForm;
