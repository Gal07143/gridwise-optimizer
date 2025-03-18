
import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import GlassPanel from '@/components/ui/GlassPanel';
import DeviceForm from '@/components/devices/DeviceForm';
import DevicePageHeader from '@/components/devices/DevicePageHeader';
import { useDeviceForm } from '@/hooks/useDeviceForm';
import { Toaster } from 'sonner';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { validateDeviceForm, errorsToRecord } from '@/utils/validation';

const AddDevice = () => {
  const {
    device,
    isSubmitting,
    isLoadingSite,
    hasSiteError,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    navigateBack
  } = useDeviceForm();
  
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  
  const handleValidatedSubmit = (e?: React.FormEvent) => {
    const errors = validateDeviceForm(device);
    const errorRecord = errorsToRecord(errors);
    
    setValidationErrors(errorRecord);
    
    if (errors.length === 0) {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <ErrorBoundary>
          <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
            <DevicePageHeader 
              title="Add New Device"
              subtitle="Add a new energy device to the system"
              onBack={navigateBack}
              onSave={handleValidatedSubmit}
              isSaving={isSubmitting}
            />
            
            {hasSiteError && (
              <div className="mb-4 p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                Warning: Using fallback site configuration. Some features may be limited.
              </div>
            )}
            
            {isLoadingSite ? (
              <div className="flex justify-center p-6">
                <div className="animate-pulse">Loading site information...</div>
              </div>
            ) : (
              <GlassPanel className="p-6">
                <DeviceForm 
                  device={device}
                  handleInputChange={handleInputChange}
                  handleSelectChange={handleSelectChange}
                  validationErrors={validationErrors}
                />
              </GlassPanel>
            )}
          </div>
        </ErrorBoundary>
      </div>
      <Toaster />
    </div>
  );
};

export default AddDevice;
