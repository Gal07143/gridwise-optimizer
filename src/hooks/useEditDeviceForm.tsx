
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';
import { getDeviceById, updateDevice } from '@/services/deviceService';

export const useEditDeviceForm = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { data: deviceData, isLoading } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => deviceId ? getDeviceById(deviceId) : null,
    enabled: !!deviceId
  });
  
  const [device, setDevice] = useState<Partial<EnergyDevice>>({
    name: '',
    location: '',
    type: 'solar' as DeviceType,
    status: 'online' as DeviceStatus,
    capacity: 0,
    firmware: '',
    description: '',
  });
  
  useEffect(() => {
    if (deviceData) {
      setDevice({
        name: deviceData.name,
        location: deviceData.location,
        type: deviceData.type,
        status: deviceData.status,
        capacity: deviceData.capacity,
        firmware: deviceData.firmware,
        description: deviceData.description,
      });
    }
  }, [deviceData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDevice(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setDevice(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!deviceId) return;
    
    // Validate inputs
    if (!device.name || !device.location || !device.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const updatedDevice = await updateDevice(deviceId, device);
      
      if (updatedDevice) {
        // Invalidate and refetch device data
        queryClient.invalidateQueries({ queryKey: ['device', deviceId] });
        queryClient.invalidateQueries({ queryKey: ['devices'] });
        
        toast.success('Device updated successfully');
        navigate(`/devices`);
      } else {
        toast.error('Failed to update device');
      }
    } catch (error) {
      console.error('Error updating device:', error);
      toast.error('An error occurred while updating the device');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    device,
    isLoading,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    navigateBack: () => navigate('/devices'),
  };
};
