
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDeviceById, updateDevice } from '@/services/deviceService';
import { useBaseDeviceForm, DeviceFormState } from './useBaseDeviceForm';

export const useEditDeviceForm = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const queryClient = useQueryClient();
  
  const { data: deviceData, isLoading } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => deviceId ? getDeviceById(deviceId) : null,
    enabled: !!deviceId
  });
  
  const handleUpdateDevice = async (deviceData: DeviceFormState) => {
    if (!deviceId) return null;
    
    const updatedDevice = await updateDevice(deviceId, deviceData);
    
    if (updatedDevice) {
      // Invalidate and refetch device data
      queryClient.invalidateQueries({ queryKey: ['device', deviceId] });
      queryClient.invalidateQueries({ queryKey: ['devices'] });
    }
    
    return updatedDevice;
  };

  const baseFormHook = useBaseDeviceForm({
    initialDevice: deviceData,
    onSubmit: handleUpdateDevice
  });

  useEffect(() => {
    if (deviceData) {
      baseFormHook.setDevice({
        name: deviceData.name,
        location: deviceData.location || '',
        type: deviceData.type,
        status: deviceData.status,
        capacity: deviceData.capacity,
        firmware: deviceData.firmware || '',
        description: deviceData.description || '',
      });
    }
  }, [deviceData]);

  return {
    ...baseFormHook,
    isLoading,
  };
};
