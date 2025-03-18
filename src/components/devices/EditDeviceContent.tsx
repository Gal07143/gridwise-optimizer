
import React from 'react';
import { useEditDeviceForm } from '@/hooks/useEditDeviceForm';
import DeviceForm from '@/components/devices/DeviceForm';
import DevicePageHeader from '@/components/devices/DevicePageHeader';
import GlassPanel from '@/components/ui/GlassPanel';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { validateDeviceForm, errorsToRecord } from '@/utils/validation';

const EditDeviceContent = () => {
  const {
    device,
    isLoading,
    isSubmitting,
    error,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    navigateBack,
    refetch
  } = useEditDeviceForm();
  
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

  const handleValidatedSubmit = (e?: React.FormEvent) => {
    if (!device) return;
    
    const errors = validateDeviceForm(device);
    const errorRecord = errorsToRecord(errors);
    
    setValidationErrors(errorRecord);
    
    if (errors.length === 0) {
      handleSubmit(e);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12">
        <LoadingSpinner size="lg" className="text-primary mb-4" />
        <p className="text-muted-foreground">Loading device information...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Alert variant="destructive" className="mb-4 max-w-lg">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Device</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load device information. The device may have been deleted or you don't have permission to view it.</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="ml-2 border-destructive hover:bg-destructive/10"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
        
        <Button onClick={navigateBack} className="mt-4">
          Return to Devices
        </Button>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Device not found</p>
      </div>
    );
  }

  return (
    <>
      <DevicePageHeader 
        title="Edit Device"
        subtitle="Modify device configuration"
        onBack={navigateBack}
        onSave={handleValidatedSubmit}
        isSaving={isSubmitting}
      />
      
      <GlassPanel className="p-6">
        <DeviceForm 
          device={device}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
          validationErrors={validationErrors}
        />
      </GlassPanel>
    </>
  );
};

export default EditDeviceContent;
