
import { useState, useCallback } from 'react';
import { EnergyDevice } from '@/types/energy';

export interface DeviceFormState extends Partial<EnergyDevice> {}

export interface UseBaseDeviceFormProps {
  initialDevice: EnergyDevice | null;
  onSubmit: (device: DeviceFormState) => Promise<EnergyDevice | null>;
}

export const useBaseDeviceForm = ({ initialDevice, onSubmit }: UseBaseDeviceFormProps) => {
  const [device, setDevice] = useState<Partial<EnergyDevice>>(
    initialDevice || {
      name: '',
      type: 'solar' as const,  // Use type assertion to fix the type
      status: 'offline' as const,  // Use type assertion to fix the type
      location: '',
      capacity: 0,
      firmware: '',
      description: ''
    }
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isChanged, setIsChanged] = useState(false);

  const handleChange = useCallback((field: keyof EnergyDevice, value: any) => {
    setDevice(prev => {
      // Only mark as changed if the value is actually different
      if (prev[field] !== value) {
        setIsChanged(true);
      }
      return { ...prev, [field]: value };
    });
  }, []);

  const handleReset = useCallback(() => {
    setDevice(
      initialDevice || {
        name: '',
        type: 'solar' as const,
        status: 'offline' as const,
        location: '',
        capacity: 0,
        firmware: '',
        description: ''
      }
    );
    setIsChanged(false);
    setError(null);
  }, [initialDevice]);

  const handleSubmit = useCallback(async () => {
    try {
      setError(null);
      setIsSubmitting(true);
      
      const result = await onSubmit(device);
      
      if (result) {
        setDevice(result);
        setIsChanged(false);
        return result;
      }
      
      return null;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      return null;
    } finally {
      setIsSubmitting(false);
    }
  }, [device, onSubmit]);

  return {
    device,
    handleChange,
    handleReset,
    handleSubmit,
    isSubmitting,
    error,
    isChanged
  };
};

export default useBaseDeviceForm;
