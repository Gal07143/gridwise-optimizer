
import React from 'react';
import DeviceForm from '../DeviceForm';

interface DeviceDetailTabProps {
  device: {
    name: string;
    location: string;
    type: string;
    status: string;
    capacity: number;
    firmware: string;
    description: string;
  };
}

const DeviceDetailTab = ({ device }: DeviceDetailTabProps) => {
  return (
    <DeviceForm 
      device={device}
      handleInputChange={() => {}}
      handleSelectChange={() => {}}
    />
  );
};

export default DeviceDetailTab;
