
import { useState, useCallback } from 'react';
import { EnergyDevice } from '@/types/energy';

interface BaseDeviceFormProps {
  initialDevice: EnergyDevice | null;
  onSubmit: (deviceData: any) => Promise<EnergyDevice | null>;
}

export const useBaseDeviceForm = ({ initialDevice, onSubmit }: BaseDeviceFormProps) => {
  const [device, setDevice] = useState<Partial<EnergyDevice>>(initialDevice || {
    name: '',
    type: '',
    status: 'offline',
    location: '',
    capacity: 0,
    firmware: '',
    description: ''
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setDevice(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseFloat(value) : '') : value
    }));
  }, []);

  const handleSelectChange = useCallback((field: string, value: string) => {
    setDevice(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = useCallback(async () => {
    return await onSubmit(device);
  }, [device, onSubmit]);

  const resetForm = useCallback(() => {
    setDevice(initialDevice || {
      name: '',
      type: '',
      status: 'offline',
      location: '',
      capacity: 0,
      firmware: '',
      description: ''
    });
  }, [initialDevice]);

  return {
    device,
    setDevice,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    resetForm
  };
};

export default useBaseDeviceForm;
