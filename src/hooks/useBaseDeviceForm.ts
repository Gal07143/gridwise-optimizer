
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
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convert capacity to number if it's the capacity field
    if (name === 'capacity') {
      setDevice(prev => ({ ...prev, [name]: value === '' ? 0 : Number(value) }));
    } else {
      setDevice(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (field: string, value: string) => {
    setDevice(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    // Basic validation
    if (!device.name.trim()) {
      toast.error("Device name is required");
      return false;
    }
    
    if (!device.location.trim()) {
      toast.error("Location is required");
      return false;
    }
    
    if (device.capacity <= 0) {
      toast.error("Capacity must be greater than zero");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Check network connection
      if (!navigator.onLine) {
        toast.warning("You are offline. Changes will be saved when you're back online.");
        // In a real app, we would implement offline storage and sync here
      }
      
      const result = await onSubmit(device);
      
      if (result) {
        toast.success('Device saved successfully');
        navigate(redirectPath);
      } else {
        toast.error('Failed to save device');
      }
    } catch (error) {
      console.error('Error saving device:', error);
      toast.error('An error occurred while saving the device');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    device,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    navigateBack: () => navigate('/devices'),
    setDevice,
  };
};
