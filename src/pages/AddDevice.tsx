
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import DeviceForm from '@/components/devices/DeviceForm';
import { useDeviceForm } from '@/hooks/useDeviceForm';
import { Button } from '@/components/ui/button';

const AddDevice = () => {
  const navigate = useNavigate();
  const {
    device,
    handleInputChange,
    handleSelectChange,
    handleSubmit,
    validationErrors,
    isSubmitting
  } = useDeviceForm();

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">Add New Device</h1>
          <p className="text-muted-foreground">Add a new device to your energy management system</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <DeviceForm
            device={device}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            validationErrors={validationErrors}
          />
          
          <div className="flex justify-end mt-8 space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate('/devices')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              onClick={() => handleSubmit()} 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Device'}
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default AddDevice;
