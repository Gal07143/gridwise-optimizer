
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getDeviceById } from '@/services/devices/queries';
import { updateDevice } from '@/services/devices/mutations';
import { useBaseDeviceForm, DeviceFormState } from './useBaseDeviceForm';
import { validateDeviceData, formatValidationErrors } from '@/services/devices/mutations/deviceValidation';
import { EnergyDevice } from '@/types/energy';

export const useEditDeviceForm = (deviceId: string) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [device, setDevice] = useState<EnergyDevice | null>(null);
  
  // Fetch the device on mount
  useEffect(() => {
    const fetchDevice = async () => {
      try {
        setIsLoading(true);
        const deviceData = await getDeviceById(deviceId);
        
        if (deviceData) {
          setDevice(deviceData);
        } else {
          setLoadError(new Error('Device not found'));
        }
      } catch (error) {
        setLoadError(error instanceof Error ? error : new Error('Failed to load device'));
        toast.error('Failed to load device details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDevice();
  }, [deviceId]);
  
  const validateDeviceForm = useCallback((data: DeviceFormState) => {
    const errors = validateDeviceData(data as Partial<EnergyDevice>);
    const formattedErrors = formatValidationErrors(errors);
    setValidationErrors(formattedErrors);
    return Object.keys(formattedErrors).length === 0;
  }, []);
  
  const handleUpdateDevice = useCallback(async (deviceData: DeviceFormState) => {
    if (!validateDeviceForm(deviceData)) {
      toast.error('Please fix the validation errors before saving');
      return null;
    }
    
    try {
      // Ensure we have an ID to update
      if (!deviceId) {
        toast.error('Missing device ID for update');
        return null;
      }
      
      console.log("Updating device with data:", deviceData);
      
      // Prepare update data
      const updateData = {
        id: deviceId,
        ...deviceData
      };
      
      // Cast type and status to their proper enum values
      if (updateData.type) {
        updateData.type = updateData.type as EnergyDevice['type'];
      }
      
      if (updateData.status) {
        updateData.status = updateData.status as EnergyDevice['status'];
      }
      
      // Handle site_id separately to ensure type safety
      if ('site_id' in deviceData) {
        const deviceWithSiteId = { ...updateData } as any;
        deviceWithSiteId.site_id = deviceData.site_id;
        
        const updatedDevice = await updateDevice(deviceWithSiteId);
        
        if (updatedDevice) {
          toast.success('Device updated successfully');
          queryClient.invalidateQueries({
            queryKey: ['devices', deviceId]
          });
          return updatedDevice;
        }
      } else {
        const updatedDevice = await updateDevice(updateData);
        
        if (updatedDevice) {
          toast.success('Device updated successfully');
          queryClient.invalidateQueries({
            queryKey: ['devices', deviceId]
          });
          return updatedDevice;
        }
      }
      
      toast.error('Failed to update device');
      return null;
    } catch (error: any) {
      console.error("Error updating device:", error);
      toast.error(`Failed to update device: ${error?.message || 'Unknown error'}`);
      return null;
    }
  }, [deviceId, queryClient, validateDeviceForm]);
  
  const baseFormHook = useBaseDeviceForm({
    initialDevice: device,
    onSubmit: handleUpdateDevice
  });
  
  return {
    ...baseFormHook,
    isLoading,
    loadError,
    validationErrors,
    validateDeviceForm,
    clearValidationError: (field: string) => {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };
};

export default useEditDeviceForm;
