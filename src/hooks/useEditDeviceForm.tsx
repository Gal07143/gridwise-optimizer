
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDeviceById, updateDevice } from '@/services/devices';
import { useBaseDeviceForm, DeviceFormState } from './useBaseDeviceForm';
import { toast } from 'sonner';
import { EnergyDevice } from '@/types/energy';
import { validateDeviceData, formatValidationErrors, ValidationError } from '@/services/devices/mutations/deviceValidation';

export const useEditDeviceForm = () => {
  const { deviceId } = useParams<{ deviceId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  
  const { 
    data: deviceData, 
    isLoading,
    error: fetchError,
    refetch
  } = useQuery({
    queryKey: ['device', deviceId],
    queryFn: () => deviceId ? getDeviceById(deviceId) : null,
    enabled: !!deviceId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  
  // Handle errors outside the query config
  useEffect(() => {
    if (fetchError) {
      toast.error(`Failed to fetch device: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      setTimeout(() => navigate('/devices'), 2000);
    }
  }, [fetchError, navigate]);
  
  const validateDeviceForm = useCallback((data: DeviceFormState): boolean => {
    const errors: ValidationError[] = validateDeviceData(data as Partial<EnergyDevice>);
    const formattedErrors = formatValidationErrors(errors);
    
    setValidationErrors(formattedErrors);
    return Object.keys(formattedErrors).length === 0;
  }, []);
  
  const handleUpdateDevice = useCallback(async (deviceData: DeviceFormState) => {
    if (!deviceId) {
      toast.error('Device ID is missing');
      return null;
    }
    
    if (!validateDeviceForm(deviceData)) {
      toast.error('Please fix the validation errors before saving');
      return null;
    }
    
    setIsSaving(true);
    
    try {
      const updatedDevice = await updateDevice(deviceId, deviceData);
      
      if (updatedDevice) {
        toast.success('Device updated successfully');
        // Invalidate and refetch device data
        queryClient.invalidateQueries({ queryKey: ['device', deviceId] });
        queryClient.invalidateQueries({ queryKey: ['devices'] });
        return updatedDevice;
      } else {
        toast.error('Failed to update device');
        return null;
      }
    } catch (error: any) {
      toast.error(`Failed to update device: ${error?.message || 'Unknown error'}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [deviceId, queryClient, validateDeviceForm]);

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
        site_id: deviceData.site_id || '',
      });
    }
  }, [deviceData]);

  return {
    ...baseFormHook,
    isLoading,
    isSaving,
    validationErrors,
    validateDeviceForm,
    error: fetchError,
    refetch,
    clearValidationError: (field: string) => {
      setValidationErrors(prev => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };
};

export default useEditDeviceForm;
