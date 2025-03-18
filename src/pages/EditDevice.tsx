
import React from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import EditDeviceContent from '@/components/devices/EditDeviceContent';
import { Toaster } from 'sonner';

const EditDevice = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6 animate-fade-in">
          <EditDeviceContent />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default EditDevice;
