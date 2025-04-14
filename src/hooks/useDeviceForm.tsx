
import { useState, useCallback } from 'react';
import { EnergyDevice } from '@/types/energy';
import { validateDeviceData, formatValidationErrors } from '@/services/devices/mutations/deviceValidation';

interface UseDeviceFormProps {
  initialDevice?: Partial<EnergyDevice>;
  onSave?: (device: Partial<EnergyDevice>) => Promise<any>;
  onSuccess?: () => void;
}

export const useDeviceForm = ({ initialDevice = {}, onSave, onSuccess }: UseDeviceFormProps) => {
  const [device, setDevice] = useState<Partial<EnergyDevice>>(initialDevice);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChanged, setIsChanged] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDevice(prev => ({ ...prev, [name]: value }));
    setIsChanged(true);
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleChange(e);
  }, [handleChange]);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setDevice(prev => ({ ...prev, [name]: value }));
    setIsChanged(true);
    
    // Clear validation error when field is edited
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const validateDeviceForm = useCallback(() => {
    const errors = validateDeviceData(device);
    if (errors.length > 0) {
      const formattedErrors = formatValidationErrors(errors);
      setValidationErrors(formattedErrors);
      return false;
    }
    return true;
  }, [device]);

  const clearValidationError = useCallback((field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    setIsSubmitting(true);
    setError(null);
    
    if (!validateDeviceForm()) {
      setIsSubmitting(false);
      return;
    }
    
    if (onSave) {
      try {
        setIsSaving(true);
        await onSave(device);
        setIsChanged(false);
        if (onSuccess) {
          onSuccess();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to save device');
      } finally {
        setIsSaving(false);
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  }, [device, validateDeviceForm, onSave, onSuccess]);

  const handleReset = useCallback(() => {
    setDevice(initialDevice);
    setValidationErrors({});
    setError(null);
    setIsChanged(false);
  }, [initialDevice]);

  return {
    device,
    handleChange,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    handleReset,
    validationErrors,
    validateDeviceForm,
    clearValidationError,
    isSubmitting,
    isSaving,
    error,
    isChanged
  };
};
