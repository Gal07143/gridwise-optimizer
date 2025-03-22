import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DeviceType, DeviceStatus, EnergyDevice } from '@/types/energy';

export interface DeviceFormState {
  name: string;
  location: string;
  type: DeviceType;
  status: DeviceStatus;
  capacity: number;
  firmware: string;
  description: string;
  site_id?: string;
}

export interface UseBaseDeviceFormProps {
  initialDevice?: Partial<DeviceFormState>;
  onSubmit: (device: DeviceFormState) => Promise<any>;
  redirectPath?: string;
}

export const useBaseDeviceForm = ({
  initialDevice,
  onSubmit,
  redirectPath = '/devices'
}: UseBaseDeviceFormProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [device, setDevice] = useState<DeviceFormState>({
    name: initialDevice?.name || '',
    location: initialDevice?.location || '',
    type: initialDevice?.type || 'solar',
    status: initialDevice?.status || 'online',
    capacity: initialDevice?.capacity || 0,
    firmware: initialDevice?.firmware || '',
    description: initialDevice?.description || '',
    site_id: initialDevice?.site_id || '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'capacity') {
      setDevice(prev => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    } else {
      setDevice(prev => ({ ...prev, [name]: value }));
    }
    
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSelectChange = (field: keyof DeviceFormState, value: string) => {
    setDevice(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!device.name.trim()) {
      errors.name = "Device name is required";
    }
    
    if (!device.location.trim()) {
      errors.location = "Location is required";
    }
    
    if (device.capacity <= 0) {
      errors.capacity = "Capacity must be greater than zero";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (!navigator.onLine) {
        toast.warning("You are offline. Changes will be saved when you're back online.");
      }
      
      const result = await onSubmit(device);
      
      if (result) {
        toast.success('Device saved successfully');
        navigate(redirectPath);
      } else {
        toast.error('Failed to save device');
      }
    } catch (error: any) {
      console.error('Error saving device:', error);
      toast.error(`An error occurred: ${error.message || 'Unknown error'}`);
      
      if (error.message) {
        const errorMessages = error.message.split(', ');
        const fieldErrors: Record<string, string> = {};
        
        errorMessages.forEach((msg: string) => {
          if (msg.includes('name')) fieldErrors.name = msg;
          else if (msg.includes('location')) fieldErrors.location = msg;
          else if (msg.includes('capacity')) fieldErrors.capacity = msg;
          else if (msg.includes('type')) fieldErrors.type = msg;
          else if (msg.includes('status')) fieldErrors.status = msg;
        });
        
        if (Object.keys(fieldErrors).length > 0) {
          setValidationErrors(fieldErrors);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    device,
    isSubmitting,
    validationErrors,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    navigateBack: () => navigate('/devices'),
    setDevice,
    resetForm: () => {
      setDevice({
        name: '',
        location: '',
        type: 'solar',
        status: 'online',
        capacity: 0,
        firmware: '',
        description: '',
        site_id: '',
      });
      setValidationErrors({});
    },
  };
};
