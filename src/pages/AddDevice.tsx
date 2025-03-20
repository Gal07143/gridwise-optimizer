
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import AppLayout from '@/components/layout/AppLayout';
import DeviceForm from '@/components/devices/DeviceForm';
import { toast } from 'sonner';

const AddDevice = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddDevice = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      // Here you would handle the actual form submission to create a device
      console.log('Adding device:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Device added successfully');
      navigate('/devices');
    } catch (error) {
      console.error('Error adding device:', error);
      toast.error('Failed to add device. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-1">Add New Device</h1>
          <p className="text-muted-foreground">Add a new device to your energy management system</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <DeviceForm onSubmit={handleAddDevice} isSubmitting={isSubmitting} />
        </div>
      </div>
    </AppLayout>
  );
};

export default AddDevice;
