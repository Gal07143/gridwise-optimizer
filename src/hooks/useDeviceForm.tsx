
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBaseDeviceForm, DeviceFormState } from './useBaseDeviceForm';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { createDevice } from '@/services/devices/createDevice';
import { validateDeviceData, formatValidationErrors } from '@/services/devices/mutations/deviceValidation';
import { EnergyDevice } from '@/types/energy';

export const useDeviceForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const validateDeviceForm = useCallback((data: DeviceFormState) => {
    const errors = validateDeviceData(data as Partial<EnergyDevice>);
    const formattedErrors = formatValidationErrors(errors);
    setValidationErrors(formattedErrors);
    return Object.keys(formattedErrors).length === 0;
  }, []);

  const handleCreateDevice = useCallback(async (deviceData: DeviceFormState) => {
    if (!validateDeviceForm(deviceData)) {
      toast.error('Please fix the validation errors before saving');
      return null;
    }

    setIsSaving(true);
    try {
      console.log("Creating device with data:", deviceData);
      
      // Create device data with site_id field
      const { name, type, status, location, capacity, firmware, description, site_id } = deviceData;
      
      const deviceToCreate: Partial<EnergyDevice> = {
        name,
        type,
        status,
        location: location || undefined,
        capacity,
        firmware: firmware || undefined,
        description: description || undefined
      };

      // Only add site_id if it exists
      if (site_id) {
        deviceToCreate.site_id = site_id;
      }
      
      const newDevice = await createDevice(deviceToCreate as Omit<EnergyDevice, 'id'>);
      
      if (newDevice) {
        toast.success('Device created successfully');
        // Invalidate and refetch devices
        queryClient.invalidateQueries({
          queryKey: ['devices']
        });
        return newDevice;
      } else {
        toast.error('Failed to create device');
        return null;
      }
    } catch (error: any) {
      console.error("Error creating device:", error);
      toast.error(`Failed to create device: ${error?.message || 'Unknown error'}`);
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [queryClient, validateDeviceForm]);

  const baseFormHook = useBaseDeviceForm({
    initialDevice: null,
    onSubmit: handleCreateDevice
  });

  return {
    ...baseFormHook,
    isSaving,
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

export default useDeviceForm;
