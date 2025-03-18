
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDeviceById, updateDevice } from '@/services/deviceService';
import { useBaseDeviceForm, DeviceFormState } from './useBaseDeviceForm';
import { toast } from 'sonner';

export const useEditDeviceForm = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const { 
    data: deviceData, 
    isLoading,
    error: fetchError
  } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => deviceId ? getDeviceById(deviceId) : null,
    enabled: !!deviceId,
    retry: 1,
    meta: {
      onError: (error: any) => {
        toast.error(`Failed to fetch device: ${error.message || 'Unknown error'}`);
        // Navigate back to devices list if device cannot be found
        setTimeout(() => navigate('/devices'), 2000);
      }
    }
  });
  
  // Handle errors outside the query config
  useEffect(() => {
    if (fetchError) {
      toast.error(`Failed to fetch device: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      setTimeout(() => navigate('/devices'), 2000);
    }
  }, [fetchError, navigate]);
  
  const validateDeviceData = (data: DeviceFormState): boolean => {
    const errors: Record<string, string> = {};
    
    if (!data.name.trim()) {
      errors.name = 'Device name is required';
    }
    
    if (!data.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (data.capacity <= 0) {
      errors.capacity = 'Capacity must be greater than 0';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleUpdateDevice = async (deviceData: DeviceFormState) => {
    if (!deviceId) {
      toast.error('Device ID is missing');
      return null;
    }
    
    if (!validateDeviceData(deviceData)) {
      toast.error('Please fix the validation errors before saving');
      return null;
    }
    
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
    validationErrors,
    validateDeviceData,
  };
};
