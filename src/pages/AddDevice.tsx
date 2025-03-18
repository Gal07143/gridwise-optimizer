
import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import GlassPanel from '@/components/ui/GlassPanel';
import DeviceForm from '@/components/devices/DeviceForm';
import DevicePageHeader from '@/components/devices/DevicePageHeader';
import { useDeviceForm } from '@/hooks/useDeviceForm';

const AddDevice = () => {
  const {
    device,
    isSubmitting,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    navigateBack
  } = useDeviceForm();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <DevicePageHeader 
            title="Add New Device"
            subtitle="Add a new energy device to the system"
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
        </div>
      </div>
    </div>
  );
};

export default AddDevice;
