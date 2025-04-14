
import { useState, useCallback } from 'react';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';

export interface DeviceFormState {
  name: string;
  type: DeviceType | string;
  status: DeviceStatus | string;
  location: string;
  capacity: number;
  firmware: string;
  description: string;
  site_id?: string;
}

interface BaseDeviceFormProps {
  initialDevice: EnergyDevice | null;
  onSubmit: (deviceData: DeviceFormState) => Promise<EnergyDevice | null>;
}

export const useBaseDeviceForm = ({ initialDevice, onSubmit }: BaseDeviceFormProps) => {
  const [device, setDevice] = useState<DeviceFormState>(initialDevice || {
    name: '',
    type: 'other' as DeviceType,
    status: 'offline' as DeviceStatus,
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
      type: 'other' as DeviceType,
      status: 'offline' as DeviceStatus,
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
