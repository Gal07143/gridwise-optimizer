
import React from 'react';
import { useEditDeviceForm } from '@/hooks/useEditDeviceForm';
import DeviceForm from '@/components/devices/DeviceForm';
import DevicePageHeader from '@/components/devices/DevicePageHeader';
import GlassPanel from '@/components/ui/GlassPanel';

const EditDeviceContent = () => {
  const {
    device,
    isLoading,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    navigateBack
  } = useEditDeviceForm();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Loading device information...</p>
      </div>
    );
  }

  return (
    <>
      <DevicePageHeader 
        title="Edit Device"
        subtitle="Modify device configuration"
        onBack={navigateBack}
        onSave={handleSubmit}
        isSaving={isSubmitting}
      />
      
      <GlassPanel className="p-6">
        <DeviceForm 
          device={device}
          handleInputChange={handleInputChange}
          handleSelectChange={handleSelectChange}
        />
      </GlassPanel>
    </>
  );
};

export default EditDeviceContent;
