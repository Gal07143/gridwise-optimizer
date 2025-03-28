
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDeviceById } from '@/services/devices/queries';
import { updateDevice } from '@/services/devices/mutations';
import { useBaseDeviceForm, DeviceFormState } from './useBaseDeviceForm';
import { toast } from 'sonner';
import { EnergyDevice, DeviceType, DeviceStatus } from '@/types/energy';
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
  });
  
  // Handle errors
  useEffect(() => {
    if (fetchError) {
      console.error("Error fetching device data:", fetchError);
      toast.error(`Failed to fetch device: ${fetchError instanceof Error ? fetchError.message : 'Unknown error'}`);
      
      // Only navigate away after a short delay so user can see the error
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
      console.log("Updating device with data:", deviceData);
      
      // Ensure type is properly cast to DeviceType
      const updatedDeviceData: Partial<EnergyDevice> = {
        ...deviceData,
        type: deviceData.type as DeviceType,
        status: deviceData.status as DeviceStatus
      };
      
      const updatedDevice = await updateDevice(deviceId, updatedDeviceData);
      
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
      console.error("Error updating device:", error);
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
      console.log("Setting form data with device:", deviceData);
      baseFormHook.setDevice({
        name: deviceData.name,
        location: deviceData.location || '',
        type: deviceData.type as DeviceType,
        status: deviceData.status as DeviceStatus,
        capacity: deviceData.capacity,
        firmware: deviceData.firmware || '',
        description: deviceData.description || '',
        site_id: deviceData.site_id || '',
      });
    }
  }, [deviceData, baseFormHook.setDevice]);

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
